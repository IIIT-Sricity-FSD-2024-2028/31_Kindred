import { User } from '../modules/users/entities/user.entity';
import { Volunteer } from '../modules/volunteers/entities/volunteer.entity';

// Explicit fields keep credentials, identity references and recovery data out of reviews.
export function reviewProfile(user?: User | null, volunteer?: Volunteer | null) {
  const profile = { ...user, ...volunteer };
  const fields = ['name','email','phone','role','org','status','bio','location','age','skills','joined','hours','rating','availableNow','currentLocation','locationUpdatedAt','availableFrom','availableUntil','availabilityDays','serviceAreas','willingToTravel','verificationStatus'];
  return Object.fromEntries(fields.filter(key => profile[key as keyof typeof profile] !== undefined).map(key => [key, profile[key as keyof typeof profile]]));
}
