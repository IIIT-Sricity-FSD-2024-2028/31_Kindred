import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { VolunteersService } from './service';
import { VolunteersController } from './controller';
import { UsersService } from '../users/service';
import { UpdatePresenceDto } from './dto/update-presence.dto';

describe('Volunteer presence', () => {
  let service: VolunteersService;
  beforeEach(() => { service = new VolunteersService(); });

  it('updates the signed-in volunteer and preserves account status and other profiles', () => {
    const controller = new VolunteersController(service, new UsersService());
    const before = service.findById('vol_002');
    const saved = controller.updatePresence('volunteer@kindred.org', { availableNow: true, currentLocation: 'Mumbai' }).data;
    expect(saved).toMatchObject({ availableNow: true, currentLocation: 'Mumbai', status: 'active' });
    expect(saved.locationUpdatedAt).toBeTruthy();
    expect(saved.availabilityUpdatedAt).toBeTruthy();
    expect(service.findById('vol_002')).toEqual(before);
    expect(service.updatePresence(saved.email, { availableNow: false })).toMatchObject({ availableNow: false, currentLocation: 'Mumbai', locationUpdatedAt: saved.locationUpdatedAt });
    expect(service.updatePresence(saved.email, { currentLocation: '' }).currentLocation).toBe('');
  });

  it('rejects missing identity and unknown volunteers', () => {
    expect(() => new VolunteersController(service, new UsersService()).updatePresence('', { availableNow: true })).toThrow(ForbiddenException);
    expect(() => service.updatePresence('missing@example.test', { availableNow: true })).toThrow(NotFoundException);
  });

  it('saves personal details for the signed-in volunteer and preserves account permissions', () => {
    const users = new UsersService();
    const controller = new VolunteersController(service, users);
    const email = 'volunteer@kindred.org';
    const before = users.findByEmail(email)!;
    const profile = controller.saveMyProfile(email, { bio:'Community teacher', location:'Mumbai', dateOfBirth:'2000-04-15', skills:['Teaching'], name:'Volunteer Teacher', phone:'9812345678' }).data;
    expect(profile).toMatchObject({id:before.id,role:'volunteer',status:before.status,bio:'Community teacher',location:'Mumbai',dateOfBirth:'2000-04-15',skills:['Teaching']});
    expect(profile.age).toBeGreaterThan(20);
    expect(profile).not.toHaveProperty('password');
    expect(profile).not.toHaveProperty('securityAnswerHash1');
    expect(service.findByEmail(email)).toMatchObject({name:'Volunteer Teacher',skills:['Teaching'],phone:'9812345678'});
    expect(controller.myProfile(email).data.bio).toBe('Community teacher');
    expect(() => controller.saveMyProfile('', {bio:'Changed'})).toThrow(ForbiddenException);
    expect(() => controller.saveMyProfile('admin@hopeconnect.org', {bio:'Changed'})).toThrow(ForbiddenException);
    for (const dateOfBirth of ['2000-02-30','2999-01-01','1800-01-01']) expect(() => controller.saveMyProfile(email, {dateOfBirth})).toThrow();
    expect(controller.myProfile(email).data.dateOfBirth).toBe('2000-04-15');
    service.delete(service.findByEmail(email)!.id);
    expect(controller.findByEmail(email).data).toMatchObject({email,status:'active'});
    expect(controller.updatePresence(email,{serviceAreas:'Mumbai',availabilityDays:['Monday'],willingToTravel:true}).data).toMatchObject({serviceAreas:'Mumbai',availabilityDays:['Monday'],willingToTravel:true});
  });

  it('trims location and validates boolean and length', async () => {
    const dto = plainToInstance(UpdatePresenceDto, { currentLocation: '  Pune  ', availableNow: false });
    expect(dto.currentLocation).toBe('Pune');
    expect(await validate(dto)).toHaveLength(0);
    expect(await validate(plainToInstance(UpdatePresenceDto, { availableNow: 'yes', currentLocation: 'x'.repeat(201) }, { enableImplicitConversion: true }))).toHaveLength(2);
  });
});
