export interface NotificationRecord {
  id: string; targetEmail?: string; targetRole?: string; targetOrg?: string; title: string; message: string; type: string; link?: string; read: boolean; createdAt: string;
}
