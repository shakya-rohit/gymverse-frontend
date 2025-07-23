import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DashboardSummary {
  totalMembers: number;
  activePlans: number;
  totalRevenue: number;
}

export interface DashboardStats {
  labels: string[];
  newMembers: number[];
  renewals: number[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/dashboard`; // adjust if deployed

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  getStats(viewType: string, year: number): Observable<DashboardStats> {
    const params = new HttpParams()
      .set('viewType', viewType)
      .set('year', year.toString());

    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`, { params });
  }
}