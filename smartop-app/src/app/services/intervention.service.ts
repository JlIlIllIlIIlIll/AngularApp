import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  private baseUrl = 'http://localhost:3000/api/interventions';

  constructor(private http: HttpClient) {}

  getSurgeonRanking(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/ranking?page=${page}&limit=${limit}`);
  }
}
