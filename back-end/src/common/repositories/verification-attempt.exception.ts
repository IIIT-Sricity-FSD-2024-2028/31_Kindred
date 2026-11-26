import { BadRequestException } from '@nestjs/common';

// An incorrect code rejects the request, while its attempt audit must survive.
export class VerificationAttemptException extends BadRequestException {}
