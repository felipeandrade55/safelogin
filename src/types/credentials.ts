export interface UserCredential {
  id: string;  // Changed from optional to required
  username?: string;
  password?: string;
}

export interface AccessCredential {
  id?: string;
  credential_id?: string;
  type: string;
  value: string;
  userCredentials: UserCredential[];
  priority?: number;
}

export interface Credential {
  id?: string;
  company_id: string;
  title: string;
  card_type: string;
  manufacturer_id?: string;
  flags?: string[];
  is_deleted?: boolean;
  deleted_at?: string;
}