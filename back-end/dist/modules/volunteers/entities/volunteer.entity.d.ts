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
}
