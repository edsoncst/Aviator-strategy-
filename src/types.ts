export type UserPlan = 'free' | 'monthly' | 'annual';

export interface UserProfile {
  uid: string;
  email: string;
  plan: UserPlan;
  expiresAt?: string;
  lastSignalAt?: string;
}

export interface Signal {
  id: string;
  multiplier: number;
  type: 'low' | 'purple' | 'pink';
  timestamp: string;
}
