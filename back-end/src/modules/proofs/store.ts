import { BadRequestException, Global, Injectable, Module, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
export interface WorkProof { id: string; collection: string; recordId: string; title: string; organization: string; volunteerEmail: string; image: string; status: 'pending' | 'approved' | 'rejected'; submittedAt: string; reviewedAt?: string; reviewer?: string; rejectionReason?: string; }
@Injectable()
export class ProofStore {
  private proofs: WorkProof[] = [];
  all(): WorkProof[] { return this.proofs.map((p) => ({ ...p })); }
  get(id: string): WorkProof { const p = this.proofs.find((p) => p.id === id); if (!p) throw new NotFoundException('Proof not found'); return p; }
  assertCanSubmit(collection: string, recordId: string): void { if (this.proofs.some((p) => p.collection === collection && p.recordId === recordId && p.status !== 'rejected')) throw new BadRequestException('Proof is already pending or verified'); }
  submit(data: Omit<WorkProof, 'id' | 'status' | 'submittedAt'>): WorkProof { this.assertCanSubmit(data.collection, data.recordId); const p: WorkProof = { ...data, id: randomUUID(), status: 'pending', submittedAt: new Date().toISOString() }; this.proofs.push(p); return { ...p }; }
  assertVerified(collection: string, recordId: string): void { if (!this.proofs.some((p) => p.collection === collection && p.recordId === recordId && p.status === 'approved')) throw new BadRequestException('Image proof must be uploaded and verified by the organization admin before completion'); }
}
@Global()
@Module({ providers: [ProofStore], exports: [ProofStore] })
export class ProofStoreModule {}
