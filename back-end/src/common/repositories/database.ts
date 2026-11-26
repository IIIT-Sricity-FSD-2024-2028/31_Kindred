import { CallHandler, ExecutionContext, INestApplication, NestInterceptor } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { DatabaseSync } from 'node:sqlite';
import { defer, lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { createLocalStateCodec } from '../local-state-codec';
import { repositoryDefinitions } from './definitions';
import { RepositoryState, SqliteRepository } from './sqlite.repository';
import { VerificationAttemptException } from './verification-attempt.exception';

type Service = Record<string, unknown>;
const snapshot = (instance: Service): RepositoryState => JSON.parse(JSON.stringify(Object.fromEntries(
  Object.entries(instance).filter(([key, value]) => Array.isArray(value) || key === 'counter' && typeof value === 'number'),
)));
const restore = (instance: Service, state: RepositoryState) => {
  for (const [key, value] of Object.entries(state)) if (Object.hasOwn(instance, key)) instance[key] = value;
};

/** Database commit is inside the HTTP boundary: failed writes restore all aggregates. */
export function enableDatabaseRepositories(app: INestApplication, file = process.env.KINDRED_DATABASE || path.resolve(process.cwd(), '../.run/kindred.sqlite'), migrationFile?: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && !fs.existsSync(file + '.payload.key') && !fs.existsSync(file + '.portable.payload.key')) throw new Error('The database encryption key is missing; restore the original key before opening saved records.');
  let codec: ReturnType<typeof createLocalStateCodec>;
  try { codec = createLocalStateCodec(file + '.payload'); }
  catch { codec = createLocalStateCodec(file + '.portable.payload', true); }
  const database = new DatabaseSync(file);
  database.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS repository_metadata(repository TEXT PRIMARY KEY,value BLOB NOT NULL); CREATE TABLE IF NOT EXISTS repository_records(repository TEXT NOT NULL,collection TEXT NOT NULL,id TEXT NOT NULL,position INTEGER NOT NULL,value BLOB NOT NULL,PRIMARY KEY(repository,collection,id)); CREATE TABLE IF NOT EXISTS repository_revision(id INTEGER PRIMARY KEY,revision INTEGER NOT NULL); INSERT OR IGNORE INTO repository_revision VALUES(1,0);');
  const instances = new Map<string, Service>();
  for (const module of app.get(ModulesContainer).values()) for (const provider of module.providers.values()) {
    const instance = provider.instance;
    if (instance) for (const [name, service] of Object.entries(repositoryDefinitions))
      if (instance.constructor.name === service) instances.set(name, instance as Service);
  }
  const missing = Object.keys(repositoryDefinitions).filter(name => !instances.has(name));
  if (missing.length) { database.close(); throw new Error(`Missing repository services: ${missing.join(', ')}`); }
  const repositories = new Map([...instances.keys()].map(name => [name, new SqliteRepository(name, database, codec)]));
  // Import the user's existing encrypted records once, without changing the legacy files.
  let legacy: Record<string, RepositoryState> = {};
  const legacySource = migrationFile || (!process.env.KINDRED_DATABASE && file === path.resolve(process.cwd(), '../.run/kindred.sqlite') ? path.resolve(process.cwd(), '../.run/server-state.enc') : null);
  if (!database.prepare('SELECT repository FROM repository_metadata LIMIT 1').get() && legacySource) {
    const primary = legacySource;
    const saved = fs.existsSync(primary) ? primary : primary.replace(/\.enc$/, '.portable.enc');
    if (fs.existsSync(saved)) {
      try {
        if (!fs.existsSync(saved + '.key')) throw new Error('The legacy record encryption key is missing.');
        legacy = JSON.parse(createLocalStateCodec(saved, saved.includes('.portable.')).decrypt(fs.readFileSync(saved)));
      } catch (error) { database.close(); throw error; }
    }
  }
  database.exec('BEGIN IMMEDIATE');
  try {
    for (const [name, instance] of instances) {
      const saved = repositories.get(name)!.read() || legacy[repositoryDefinitions[name as keyof typeof repositoryDefinitions]];
      if (saved) restore(instance, saved);
    }
    (instances.get('tasks') as { rebuildProgramProgress?: () => void } | undefined)?.rebuildProgramProgress?.();
    for (const [name, instance] of instances) repositories.get(name)!.save(snapshot(instance));
    database.exec('COMMIT');
  } catch (error) { database.exec('ROLLBACK'); database.close(); throw error; }

  class RepositoryTransactionInterceptor implements NestInterceptor {
    private tail = Promise.resolve();
    intercept(context: ExecutionContext, next: CallHandler) {
      return defer(async () => {
        let release!: () => void;
        const previous = this.tail;
        this.tail = new Promise<void>(resolve => { release = resolve; });
        await previous;
        const before = new Map([...instances].map(([name, instance]) => [name, snapshot(instance)]));
        try {
          database.exec('BEGIN IMMEDIATE');
          const response = await lastValueFrom(next.handle());
          for (const [name, instance] of instances) repositories.get(name)!.save(snapshot(instance));
          database.exec('UPDATE repository_revision SET revision=revision+1 WHERE id=1');
          const { revision } = database.prepare('SELECT revision FROM repository_revision WHERE id=1').get() as { revision: number };
          database.exec('COMMIT');
          context.switchToHttp().getResponse().setHeader('X-Kindred-Revision', revision);
          return response;
        } catch (error) {
          // Preserve the existing attempt limit without committing a failed entity
          // operation. Only this explicit audit collection survives domain rejection.
          const attempts = error instanceof VerificationAttemptException ? snapshot(instances.get('users')!).verificationChallenges : null;
          if (database.isTransaction) database.exec('ROLLBACK');
          for (const [name, state] of before) restore(instances.get(name)!, state);
          if (attempts) {
            const users = instances.get('users')!;
            users.verificationChallenges = attempts;
            try {
              database.exec('BEGIN IMMEDIATE');
              repositories.get('users')!.save(snapshot(users));
              database.exec('UPDATE repository_revision SET revision=revision+1 WHERE id=1');
              database.exec('COMMIT');
            } catch (databaseError) {
              if (database.isTransaction) database.exec('ROLLBACK');
              restore(users, before.get('users')!);
              throw databaseError;
            }
          }
          throw error;
        } finally { release(); }
      });
    }
  }
  app.useGlobalInterceptors(new RepositoryTransactionInterceptor());
  app.getHttpServer().once('close', () => database.close());
  return { database, repositories };
}
