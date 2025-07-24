import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MembershipPlan } from '../models/membership-plan.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MembershipPlanService {
  private baseUrl = `${environment.apiUrl}/membership-plans`; // adjust if deployed

  constructor(private http: HttpClient) {}

  getAllPlans(): Observable<MembershipPlan[]> {
    return this.http.get<MembershipPlan[]>(this.baseUrl);
  }

  create(plan: MembershipPlan): Observable<MembershipPlan> {
    return this.http.post<MembershipPlan>(this.baseUrl, plan);
  }

  update(planId: string, plan: MembershipPlan): Observable<MembershipPlan> {
    return this.http.put<MembershipPlan>(`${this.baseUrl}/${planId}`, plan);
  }

  delete(planId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${planId}`);
  }
}