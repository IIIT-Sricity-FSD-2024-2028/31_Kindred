export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  initials: string;
  avatar: string;
  dashboard: string;
  org?: string;
  phone?: string;
  bio?: string;
  registeredAt: string;
  skills?: string[];
}
