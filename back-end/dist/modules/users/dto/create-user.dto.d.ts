export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: string;
    org?: string;
    phone?: string;
    bio?: string;
    skills?: string[];
    dateOfBirth?: string;
    location?: string;
    presentAddress?: string;
    permanentAddress?: string;
    availabilityDays?: string[];
    verificationToken?: string;
    verificationReference?: string;
    businessName?: string;
    businessDescription?: string;
    securityQuestion1?: string;
    securityAnswer1?: string;
    securityQuestion2?: string;
    securityAnswer2?: string;
}
