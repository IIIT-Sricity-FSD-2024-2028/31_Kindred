import { validDate, Schedule, SchedulingService, weekDays } from '../../common/scheduling';
import { Inject, BadRequestException } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Volunteer } from './entities/volunteer.entity';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';

@Injectable()
export class VolunteersService {
  @Inject(SchedulingService) private scheduling: SchedulingService;
  deliveryEligibility(email:string,schedule:Schedule,ignore?:string) {
    const result=this.eligibility(email,schedule,ignore,true),volunteer=this.findByEmail(email);
    if(!volunteer?.availableNow)result.reasons.push('Volunteer must switch Available now on');
    if(!volunteer?.currentLocation?.trim())result.reasons.push('Volunteer must save their current location');
    return {...result,eligible:!result.reasons.length};
  }
  portalEligibility(email:string,schedule:Schedule,ignore?:string,confirmed=false){
    const ordinary=this.eligibility(email,schedule,ignore);
    if(!confirmed)return ordinary;
    const volunteer=this.findByEmail(email),reasons:string[]=[];
    if(!volunteer||volunteer.status!=='active')reasons.push('Active volunteer profile required');
    return {eligible:!reasons.length,reasons,conflicts:this.scheduling.conflicts(email,schedule,ignore),warnings:[...ordinary.warnings,...ordinary.reasons.map(reason=>`Saved preference: ${reason}`)]};
  }
  eligibility(email: string, schedule: Schedule, ignore?: string, allowConflicts=false) {
    const v = this.findByEmail(email);
    const reasons: string[] = [], warnings: string[] = [];
    if (!v || v.status !== 'active') reasons.push('Active volunteer profile required');
    if (v) {
      if (v.availableFrom && schedule.startDate < v.availableFrom || v.availableUntil && schedule.endDate > v.availableUntil) reasons.push('Outside planned available dates');
      if(v.availabilityDays?.length){
        const actualDays:string[]=[];
        for(let day=new Date(schedule.startDate+'T12:00:00Z'),n=0;n<7&&!Number.isNaN(day.getTime())&&day.toISOString().slice(0,10)<=schedule.endDate;n++,day.setUTCDate(day.getUTCDate()+1)){
          const name=weekDays[day.getUTCDay()];if(!schedule.shiftDays?.length||schedule.shiftDays.includes(name))actualDays.push(name);
        }
        if(actualDays.some(day=>!v.availabilityDays!.includes(day)))reasons.push('Shift includes unavailable weekdays');
      }
      const normalize = (s: string) => s.trim().toLowerCase();
      const areas = [v.currentLocation || '',...(v.serviceAreas || '').split(',')].map(normalize).filter(Boolean);
      const local = schedule.location.split(' -> ').every(place=>areas.some(area => normalize(place).includes(area) || area.includes(normalize(place))));
      if (!local && v.willingToTravel === false) reasons.push('Outside service areas; volunteer does not wish to travel');
      if (!local) warnings.push('Travel to this location needs confirmation');
      if (!v.availableFrom || !v.availableUntil) warnings.push('Planned available dates not provided');
      if (!v.availableNow) warnings.push('Not marked available now; confirm the proposed shift');
      if (!v.locationUpdatedAt || Date.now()-Date.parse(v.locationUpdatedAt)>86400000) warnings.push('Location is missing or more than one day old');
      const conflictNotes=this.scheduling.conflicts(email,schedule,ignore).map(title => `Conflicts with ${title}`);
      (allowConflicts?warnings:reasons).push(...conflictNotes);
    }
    return { eligible: !reasons.length, reasons, warnings, conflicts:this.scheduling.conflicts(email,schedule,ignore) };
  }
  private volunteers: Volunteer[] = [
    { id: 'vol_001', name: 'Priya Singh', email: 'volunteer@kindred.org', phone: '+91 99887 76655', role: 'Field Coordinator', org: 'HopeConnect', status: 'active', joined: '2024-01-15', hours: 320, rating: 4.9, skills: ['Field Work', 'Community Outreach', 'Logistics'] },
    { id: 'vol_002', name: 'Amit Sharma', email: 'amit.sharma@email.com', phone: '+91 99887 76656', role: 'Medical Volunteer', org: 'HopeConnect', status: 'active', joined: '2024-02-10', hours: 210, rating: 4.7, skills: ['Medical Aid', 'Counseling', 'Field Work'] },
    { id: 'vol_003', name: 'Sunita Rao', email: 'sunita.rao@email.com', phone: '+91 99887 76657', role: 'Education Specialist', org: 'HopeConnect', status: 'active', joined: '2024-01-20', hours: 180, rating: 4.8, skills: ['Teaching', 'Administration', 'Community Outreach'] },
    { id: 'vol_004', name: 'Kiran Patel', email: 'kiran.patel@email.com', phone: '+91 99887 76658', role: 'Logistics Officer', org: 'HopeConnect', status: 'inactive', joined: '2024-03-05', hours: 90, rating: 4.2, skills: ['Logistics', 'Construction', 'Technology'] },
    { id: 'vol_005', name: 'Deepak Kumar', email: 'deepak.kumar@email.com', phone: '+91 99887 76659', role: 'Community Outreach', org: 'HopeConnect', status: 'active', joined: '2024-01-08', hours: 450, rating: 4.9, skills: ['Community Outreach', 'Cooking', 'Field Work', 'Environment'] },
    { id: 'vol_006', name: 'Anjali Mehta', email: 'anjali.mehta@email.com', phone: '+91 99887 76660', role: 'Field Coordinator', org: 'HopeConnect', status: 'active', joined: '2024-04-01', hours: 130, rating: 4.5, skills: ['Field Work', 'Translation', 'Teaching'] },
  ];
  private counter = 100;

  private generateId(): string {
    return `vol_${Date.now()}_${this.counter++}`;
  }

  setRating(email:string,rating:number) { const volunteer=this.findByEmail(email);if(volunteer)volunteer.rating=rating; }
  findAll(): Volunteer[] {
    return this.volunteers.slice();
  }

  findById(id: string): Volunteer {
    const vol = this.volunteers.find((v) => v.id === id);
    if (!vol) throw new NotFoundException(`Volunteer with id '${id}' not found`);
    return { ...vol };
  }

  findByEmail(email: string): Volunteer | null {
    return this.volunteers.find((v) => v.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findByOrg(org: string): Volunteer[] {
    return this.volunteers.filter((v) => v.org === org);
  }

  create(dto: CreateVolunteerDto): Volunteer {
    const newVol: Volunteer = {
      id: this.generateId(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
      org: dto.org,
      skills: dto.skills || [],
      status: 'active',
      joined: new Date().toISOString().split('T')[0],
      hours: 0,
      rating: '—',
    };
    this.volunteers.push(newVol);
    return { ...newVol };
  }

  update(id: string, dto: UpdateVolunteerDto): Volunteer {
    const idx = this.volunteers.findIndex((v) => v.id === id);
    if (idx === -1) throw new NotFoundException(`Volunteer with id '${id}' not found`);
    this.volunteers[idx] = { ...this.volunteers[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
    return { ...this.volunteers[idx] };
  }

  updatePresence(email: string, dto: UpdatePresenceDto): Volunteer {
    const volunteer = this.findByEmail(email);
    if (!volunteer) throw new NotFoundException('Volunteer profile not found');
    const from = dto.availableFrom ?? volunteer.availableFrom, until = dto.availableUntil ?? volunteer.availableUntil;
    if (from && !validDate(from) || until && !validDate(until) || from && until && until < from) throw new BadRequestException('Select valid available dates in order');
    Object.assign(volunteer,Object.fromEntries(['availableFrom','availableUntil','availabilityDays','willingToTravel','serviceAreas'].filter(key=>(dto as unknown as Record<string,unknown>)[key]!==undefined&&(dto as unknown as Record<string,unknown>)[key]!==null).map(key=>[key,(dto as unknown as Record<string,unknown>)[key]])));
    const now = new Date().toISOString();
    if (dto.availableNow !== undefined && dto.availableNow !== null) {
      volunteer.availableNow = dto.availableNow;
      volunteer.availabilityUpdatedAt = now;
    }
    if (dto.currentLocation !== undefined && dto.currentLocation !== null) {
      volunteer.currentLocation = dto.currentLocation;
      volunteer.locationUpdatedAt = now;
    }
    return { ...volunteer };
  }

  delete(id: string): boolean {
    const idx = this.volunteers.findIndex((v) => v.id === id);
    if (idx === -1) throw new NotFoundException(`Volunteer with id '${id}' not found`);
    this.volunteers.splice(idx, 1);
    return true;
  }
}
