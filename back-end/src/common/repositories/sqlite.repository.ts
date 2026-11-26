import { DatabaseSync } from 'node:sqlite';
import { createLocalStateCodec } from '../local-state-codec';

export type RepositoryState = Record<string, unknown[] | number>;
type Codec = ReturnType<typeof createLocalStateCodec>;

/** Stores an aggregate's collections as individual encrypted SQLite records. */
export class SqliteRepository {
  constructor(readonly name: string, private db: DatabaseSync, private codec: Codec) {}

  read(): RepositoryState | null {
    const meta = this.db.prepare('SELECT value FROM repository_metadata WHERE repository = ?').get(this.name) as { value: Uint8Array } | undefined;
    if (!meta) return null;
    const state = JSON.parse(this.codec.decrypt(Buffer.from(meta.value))) as RepositoryState;
    const rows = this.db.prepare('SELECT collection, value FROM repository_records WHERE repository = ? ORDER BY position').all(this.name) as { collection: string; value: Uint8Array }[];
    for (const row of rows) (state[row.collection] as unknown[]).push(JSON.parse(this.codec.decrypt(Buffer.from(row.value))));
    return state;
  }

  save(state: RepositoryState): void {
    const metadata: RepositoryState = {};
    const previous = this.db.prepare('SELECT collection, id, value, position FROM repository_records WHERE repository = ?').all(this.name) as { collection: string; id: string; value: Uint8Array; position: number }[];
    const existing = new Map(previous.map(row => [`${row.collection}:${row.id}`, row]));
    const upsert = this.db.prepare('INSERT INTO repository_records(repository,collection,id,position,value) VALUES(?,?,?,?,?) ON CONFLICT(repository,collection,id) DO UPDATE SET position=excluded.position,value=excluded.value');
    for (const [collection, values] of Object.entries(state)) {
      if (!Array.isArray(values)) { metadata[collection] = values; continue; }
      metadata[collection] = [];
      values.forEach((value: { id?: string } | null, position) => {
        const id = String(value?.id ?? position), key = `${collection}:${id}`, old = existing.get(key);
        const text = JSON.stringify(value);
        if (!old || old.position !== position || this.codec.decrypt(Buffer.from(old.value)) !== text)
          upsert.run(this.name, collection, id, position, this.codec.encrypt(text));
        existing.delete(key);
      });
    }
    const remove = this.db.prepare('DELETE FROM repository_records WHERE repository=? AND collection=? AND id=?');
    for (const row of existing.values()) remove.run(this.name, row.collection, row.id);
    this.db.prepare('INSERT INTO repository_metadata(repository,value) VALUES(?,?) ON CONFLICT(repository) DO UPDATE SET value=excluded.value').run(this.name, this.codec.encrypt(JSON.stringify(metadata)));
  }
}
