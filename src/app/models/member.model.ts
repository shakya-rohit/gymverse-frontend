export interface Member {
  memberId?: string; // optional for new records
  name: string;
  age: number;
  membership: string;
  status: string;
  joiningDate?: string;
  expiryDate?: string;
  membershipPlanId?: string;
}