export type User = {
  object: 'user';
  id: string;
  email: string;
  emailVerified: boolean;
  profilePictureUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Impersonator {
  email: string;
  reason: string | null;
}

export type UserInfo = {
  user: User;
  sessionId: string;
  organizationId?: string;
  role?: string;
  permissions?: string[];
  impersonator?: Impersonator;
  accessToken: string;
}

export type Session = {
  user: User | null;
  sessionId?: string;
  organizationId?: string;
  role?: string;
  permissions?: string[];
  impersonator?: Impersonator;
  accessToken?: string;
}