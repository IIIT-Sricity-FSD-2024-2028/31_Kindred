import { INestApplication } from '@nestjs/common';
import { ProgramsService } from '../src/modules/programs/service';
import { VolunteersService } from '../src/modules/volunteers/service';
import { UsersService } from '../src/modules/users/service';
import { ProgramAssignmentsService } from '../src/modules/program-assignments/service';

// Test-only preparation follows current scheduling and attendance rules. No
// production defaults are changed to accommodate old, expired test dates.
export const futureDate = (days = 7) => new Date(Date.now() + days * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
export const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export function scheduledProgram() {
  return { focus: ['Education'], startDate: futureDate(), endDate: futureDate(14), shiftStart: '09:00', shiftEnd: '11:00', shiftDays: weekdays,
    reportingTime: '08:45', invitationDeadline: futureDate(1), location: 'Pune', meetingPoint: 'Community center, Pune', workBrief: 'Coordinate the scheduled community support work.', contactName: 'Program coordinator', contactPhone: '9812345678' };
}
export function readyVolunteer(app: INestApplication, email: string) {
  const service = app.get(VolunteersService);
  const user = app.get(UsersService).findByEmail(email);
  const profile = service.findByEmail(email) || service.create({ name: user?.name || email.split('@')[0], email, phone: '9812345678', role: 'Volunteer', org: 'HopeConnect', skills: [] });
  service.updatePresence(email, { availableNow: true, currentLocation: 'Pune', availableFrom: futureDate(0), availableUntil: futureDate(60), availabilityDays: weekdays, serviceAreas: 'Pune', willingToTravel: true });
  return profile;
}
export function confirmExistingProgram(app: INestApplication, id: string, email: string) {
  readyVolunteer(app, email);
  const program = app.get(ProgramsService).update(id, scheduledProgram());
  const memberships = app.get(ProgramAssignmentsService);
  const membership = memberships.findByVolunteer(email).find(record => record.programId === id)!;
  memberships.respond(membership.id, email, 'accepted', { attendanceConfirmed: true, version: program.version || 1 });
}
