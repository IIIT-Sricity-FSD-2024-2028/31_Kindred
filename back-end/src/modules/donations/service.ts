import { Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { MonetaryDonation } from './entities/donation.entity';

@Injectable()
export class DonationsService {
  private donations: MonetaryDonation[] = [];
  private counter = 100;

  findAll(): MonetaryDonation[] { return this.donations.slice(); }

  findByOrg(org: string): MonetaryDonation[] { return this.donations.filter(d => (d.org || '').toLowerCase().includes(org.toLowerCase())); }

  create(dto: CreateDonationDto): MonetaryDonation {
    const rec: MonetaryDonation = {
      id: dto.id || `KND-DON-${Date.now()}-${this.counter++}`,
      org: dto.org,
      amount: dto.amount,
      frequency: dto.frequency || 'one-time',
      donor: dto.donor,
      email: dto.email,
      cardLast4: dto.cardLast4 || '',
      cardType: dto.cardType || 'Card',
      status: dto.status || 'paid',
      date: dto.date || new Date().toISOString(),
    };
    this.donations.unshift(rec);
    return { ...rec };
  }

  todayTotal(): { date: string; total: number; count: number } {
    const date = new Date().toISOString().slice(0, 10);
    const todays = this.donations.filter((d) => d.date.startsWith(date) && d.status === 'paid');
    return { date, total: todays.reduce((sum, d) => sum + d.amount, 0), count: todays.length };
  }
}
