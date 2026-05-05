import { Injectable, NotFoundException } from '@nestjs/common';
import { HourLog } from './entities/hour-log.entity';
import { CreateHourLogDto } from './dto/create-hour-log.dto';
import { UpdateHourLogDto } from './dto/update-hour-log.dto';

@Injectable()
export class HourLogsService {
  private hourLogs: HourLog[] = [];
  private counter = 100;

  private generateId(): string {
    return `hlog_${Date.now()}_${this.counter++}`;
  }

  findAll(): HourLog[] {
    return this.hourLogs.slice();
  }

  findById(id: string): HourLog {
    const log = this.hourLogs.find((l) => l.id === id);
    if (!log) throw new NotFoundException(`Hour log with id '${id}' not found`);
    return { ...log };
  }

  findByVolunteer(email: string): HourLog[] {
    return this.hourLogs.filter(
      (l) => l.volunteerEmail && l.volunteerEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  getPending(): HourLog[] {
    return this.hourLogs.filter((l) => l.status === 'pending');
  }

  create(dto: CreateHourLogDto): HourLog {
    const newLog: HourLog = {
      id: this.generateId(),
      volunteerEmail: dto.volunteerEmail,
      volunteerName: dto.volunteerName,
      hours: dto.hours,
      date: dto.date,
      description: dto.description,
      programId: dto.programId,
      programName: dto.programName,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    this.hourLogs.push(newLog);
    return { ...newLog };
  }

  update(id: string, dto: UpdateHourLogDto): HourLog {
    const idx = this.hourLogs.findIndex((l) => l.id === id);
    if (idx === -1) throw new NotFoundException(`Hour log with id '${id}' not found`);
    this.hourLogs[idx] = { ...this.hourLogs[idx], ...dto };
    return { ...this.hourLogs[idx] };
  }

  approve(id: string): HourLog {
    const idx = this.hourLogs.findIndex((l) => l.id === id);
    if (idx === -1) throw new NotFoundException(`Hour log with id '${id}' not found`);
    this.hourLogs[idx].status = 'approved';
    this.hourLogs[idx].reviewedAt = new Date().toISOString();
    return { ...this.hourLogs[idx] };
  }

  reject(id: string): HourLog {
    const idx = this.hourLogs.findIndex((l) => l.id === id);
    if (idx === -1) throw new NotFoundException(`Hour log with id '${id}' not found`);
    this.hourLogs[idx].status = 'rejected';
    this.hourLogs[idx].reviewedAt = new Date().toISOString();
    return { ...this.hourLogs[idx] };
  }

  delete(id: string): boolean {
    const idx = this.hourLogs.findIndex((l) => l.id === id);
    if (idx === -1) throw new NotFoundException(`Hour log with id '${id}' not found`);
    this.hourLogs.splice(idx, 1);
    return true;
  }
}
