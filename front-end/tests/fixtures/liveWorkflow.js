import { expect } from '@playwright/test';
import { API_BASE } from '../apiBase.js';

export const futureDate = (days = 7) => new Date(Date.now() + days * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
export const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export const scheduledProgram = () => ({ startDate: futureDate(), endDate: futureDate(14), shiftStart: '09:00', shiftEnd: '11:00', shiftDays: weekdays, reportingTime: '08:45', invitationDeadline: futureDate(1), location: 'Pune', meetingPoint: 'Community center, Pune', contactName: 'Coordinator', contactPhone: '9812345678', workBrief: 'Help with scheduled community support work.' });
const credentials = {
  superuser: ['super@kindred.org','Super@123'], admin: ['admin@hopeconnect.org','Admin@123'],
  volunteer: ['volunteer@kindred.org','Vol@123'], donor: ['donor@kindred.org','Donor@123'],
  beneficiary: ['beneficiary@kindred.org','Ben@123'], seller: ['seller@kindred.org','Seller@123'],
};
export async function login(request, role) {
  const [email,password] = credentials[role];
  const response = await request.post(`${API_BASE}/users/signin`, { data: { email,password,role } });
  expect(response.ok()).toBe(true);
  const body = await response.json(); expect(body.success).toBe(true); return body.data;
}
export async function authenticatedHeaders(request, role) {
  const session = await login(request, role);
  return { role, 'user-email': session.email, organization: session.org || '', Authorization: `Bearer ${session.authToken}` };
}
export async function readyVolunteer(request) {
  const headers = await authenticatedHeaders(request, 'volunteer');
  const response = await request.patch(`${API_BASE}/volunteers/me/presence`, { headers, data: { availableNow: true, currentLocation: 'Pune', availableFrom: futureDate(0), availableUntil: futureDate(60), availabilityDays: weekdays, serviceAreas: 'Pune', willingToTravel: true } });
  expect(response.ok()).toBe(true); return headers;
}
export const proofImage = { name: 'verification.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=','base64') };
export async function submitProof(request, collection, recordId, headers) {
  const response = await request.post(`${API_BASE}/proofs`, { headers, multipart: { collection, recordId, file: proofImage } });
  expect(response.ok(), await response.text()).toBe(true); return (await response.json()).data;
}
