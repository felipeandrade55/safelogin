export interface CredentialChange {
  id: string;
  credentialId: string;
  credentialTitle: string;
  companyId: string;
  companyName: string;
  changeType: 'create' | 'update' | 'delete';
  changedFields: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  timestamp: number;
  userId: string;
  userName: string;
}