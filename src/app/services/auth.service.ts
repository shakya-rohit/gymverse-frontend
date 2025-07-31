import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string, tenantId: string }>(`${this.apiUrl}/login`, credentials);
  }

  register(user: { name: string; email: string; username: string; password: string, role: string, gymName: string }) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  saveTenantId(tenantId: string) {
    localStorage.setItem('tenantId', tenantId);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getTenantId(): string | null {
    return localStorage.getItem('tenantId');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}