import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  // Méthode pour récupérer le message depuis la route /test
  getTestMessage(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/test`); // ✅ Correction de l'URL
  }
  
  register(user:User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/register`, user);
  }
}
