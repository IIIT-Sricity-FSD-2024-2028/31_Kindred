export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  org: string;
  status: string;
  joined: string;
  hours: number;
  rating: number | string;
  skills: string[];
  availableFrom?: string;
  availableUntil?: string;
  availabilityDays?: string[];
  willingToTravel?: boolean;
  serviceAreas?: string;
  availableNow?: boolean;
  currentLocation?: string;
  availabilityUpdatedAt?: string;
  locationUpdatedAt?: string;
}
