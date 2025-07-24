export interface MembershipPlan {
  planId?: string;
  name: string;
  durationInMonths: number;
  price: number;
  features?: string;
}