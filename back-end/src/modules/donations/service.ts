import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { MonetaryDonation } from './entities/donation.entity';
import { OrganizationsService } from '../organizations/service';
import { ProgramsService } from '../programs/service';
@Injectable()
export class DonationsService {
  private donations: MonetaryDonation[] = [];
  private counter = 100;
  constructor(private readonly organizations: OrganizationsService, private readonly programs: ProgramsService) {}
  findAll(): MonetaryDonation[] { return this.donations.map((d) => ({ ...d })); }
  findById(id: string): MonetaryDonation { const d = this.donations.find((d) => d.id === id); if (!d) throw new NotFoundException('Donation not found'); return { ...d }; }
  findByOrg(org: string): MonetaryDonation[] { return this.findAll().filter((d) => d.org.toLowerCase() === org.toLowerCase() || d.orgId === org); }
  findByDonor(email: string): MonetaryDonation[] { return this.findAll().filter((d) => d.email.toLowerCase() === email.toLowerCase()); }
  balance(org: string) { const donations = this.findByOrg(org); return { verifiedTotal: donations.filter((d) => d.status === 'paid').reduce((n,d) => n+d.amount,0), pendingTotal: donations.filter((d) => d.status === 'pending').reduce((n,d) => n+d.amount,0), verifiedCount: donations.filter((d) => d.status === 'paid').length }; }
  publicTotals() { return this.organizations.findPublic().map((org) => ({ orgId: org.id, org: org.name, total: this.balance(org.name).verifiedTotal, count: this.balance(org.name).verifiedCount, paymentMode: 'card_demo' })); }
  create(dto: CreateDonationDto): MonetaryDonation {
    const org = this.organizations.findPublic().find((o) => o.id === dto.org || o.name.toLowerCase() === dto.org.toLowerCase());
    if (!org) throw new BadRequestException('Select a publicly approved organization');
    if (!org.bankAccountName || !/^\d{9,18}$/.test(org.bankAccountNumber || '') || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(org.bankIfsc || '')) throw new BadRequestException('The organization must configure valid bank details before accepting donations');
    if (!/^\d{4}$/.test(dto.cardLast4 || '') || !['Visa','Mastercard'].includes(dto.cardType || '')) throw new BadRequestException('Valid masked card details are required for the card demo');
    if (dto.programId && !this.programs.findPublic().some((p) => p.id === dto.programId && p.org === org.name)) throw new BadRequestException('Select an approved public program belonging to the donation recipient');
    const d: MonetaryDonation = { id: `KND-DON-${Date.now()}-${this.counter++}`, org: org.name, orgId: org.id, programId: dto.programId || '', amount: dto.amount, frequency: 'one-time', donor: dto.donor, email: dto.email, cardLast4: dto.cardLast4!, cardType: dto.cardType!, status: 'paid', paymentMode: 'card_demo', date: new Date().toISOString(), taxReceiptEligible: false, bankAccountName: org.bankAccountName, bankAccountNumber: org.bankAccountNumber!, bankIfsc: org.bankIfsc!, transferReference: '', proofUrl: '' };
    this.donations.unshift(d); if (d.programId) this.programs.creditDonation(d.programId, d.amount); return { ...d };
  }
  issueCertificate(id: string): MonetaryDonation {
    const d = this.donations.find((d) => d.id === id); if (!d) throw new NotFoundException('Donation not found');
    if (d.status !== 'paid') throw new BadRequestException('Only recorded card donations can receive a thank-you certificate');
    d.certificateNumber ||= `THANKS-${this.counter++}-${Date.now()}`; d.certificateIssuedAt ||= new Date().toISOString(); return { ...d };
  }
  todayTotal() { const date = new Date().toISOString().slice(0,10); const d = this.donations.filter((d) => d.status === 'paid' && d.date.startsWith(date)); return { date, total: d.reduce((n,d) => n+d.amount,0), count: d.length }; }
}
