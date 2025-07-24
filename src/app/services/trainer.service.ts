import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trainer } from '../models/trainer.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private baseUrl = `${environment.apiUrl}/trainers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(this.baseUrl);
  }

  create(trainer: Trainer): Observable<Trainer> {
    return this.http.post<Trainer>(this.baseUrl, trainer);
  }

  update(trainerId: string, trainer: Trainer): Observable<Trainer> {
    return this.http.put<Trainer>(`${this.baseUrl}/${trainerId}`, trainer);
  }

  delete(trainerId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${trainerId}`);
  }
}