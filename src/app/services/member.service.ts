import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Member } from '../models/Member.model';


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = `${environment.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  getById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  create(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  update(id: string, member: Member): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
