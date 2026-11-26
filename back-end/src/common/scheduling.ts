import { BadRequestException, ConflictException, Global, Injectable, Module } from '@nestjs/common';

export interface Schedule {
  startDate: string; endDate: string; shiftStart?: string; shiftEnd?: string;
  shiftDays?: string[]; timeZone?: string; location: string;
}
export const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const indiaDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
export function scheduleHasEnded(s:Schedule,now=new Date()){
  const date=now.toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
  const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
  return s.endDate<date || s.endDate===date&&!!s.shiftEnd&&s.shiftEnd<=time;
}
export function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}
export function validateSchedule(s: Schedule) {
  if(!s.location?.trim())throw new BadRequestException('A program location or delivery area is required');
  if(s.shiftDays && !Array.isArray(s.shiftDays))throw new BadRequestException('Shift days must be a list');
  if (!validDate(s.startDate) || !validDate(s.endDate) || s.endDate < s.startDate) throw new BadRequestException('Select valid start and end dates, with end on or after start');
  if (s.timeZone && s.timeZone !== 'Asia/Kolkata') throw new BadRequestException('Schedules use India time (Asia/Kolkata)');
  if (s.shiftStart || s.shiftEnd) {
    if (![s.shiftStart,s.shiftEnd].every(t => /^([01]\d|2[0-3]):[0-5]\d$/.test(t || '')) || s.shiftEnd! <= s.shiftStart!) throw new BadRequestException('Select a start and end time within the same day');
  }
  if (s.shiftDays?.some(d => !weekDays.includes(d))) throw new BadRequestException('Invalid shift day');
}
export function scheduleOverlaps(a: Schedule, b: Schedule) {
  const start = a.startDate > b.startDate ? a.startDate : b.startDate;
  const end = a.endDate < b.endDate ? a.endDate : b.endDate;
  if (start > end || (a.shiftEnd || '23:59') <= (b.shiftStart || '00:00') || (b.shiftEnd || '23:59') <= (a.shiftStart || '00:00')) return false;
  // Seven dates are enough to find the intersection of recurring weekdays.
  for (let day = new Date(start+'T12:00:00Z'), n = 0; n < 7 && day.toISOString().slice(0,10) <= end; n++, day.setUTCDate(day.getUTCDate()+1)) {
    const name = weekDays[day.getUTCDay()];
    if ((!a.shiftDays?.length || a.shiftDays.includes(name)) && (!b.shiftDays?.length || b.shiftDays.includes(name))) return true;
  }
  return false;
}
interface Commitment { key: string; email: string; title: string; schedule: Schedule; }
@Injectable()
export class SchedulingService {
  private commitments: Commitment[] = [];
  conflicts(email: string, schedule: Schedule, ignore?: string) {
    return this.commitments.filter(c => c.key !== ignore && c.email.toLowerCase() === email.toLowerCase() && scheduleOverlaps(c.schedule,schedule)).map(c => c.title);
  }
  reserve(key: string, email: string, title: string, schedule: Schedule, allowConflicts = false) {
    validateSchedule(schedule);
    const conflicts = this.conflicts(email,schedule,key);
    if (conflicts.length && !allowConflicts) throw new ConflictException(`Schedule conflicts with: ${conflicts.join(', ')}`);
    this.release(key); this.commitments.push({ key,email,title,schedule: { ...schedule } });
  }
  release(key: string) { this.commitments = this.commitments.filter(c => c.key !== key); }
}
@Global()
@Module({ providers: [SchedulingService], exports: [SchedulingService] })
export class SchedulingModule {}
