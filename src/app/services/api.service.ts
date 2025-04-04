import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  // Méthode pour récupérer le message depuis la route /test
  getTestMessage(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/test`, {
      withCredentials: true,
    }); // ✅ Correction de l'URL
  }

  getTestProtected(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/protected`, {
      withCredentials: true,
    }); // ✅ Correction de l'URL
  }

  forgotPassword(user: User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/forgot-password`, user, {
      withCredentials: true,
    });
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/register`, user, {
      withCredentials: true,
    });
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/login`, user, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/users/logout`,
      {},
      { withCredentials: true }
    );
  }

  // api.service.ts
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${environment.apiUrl}/users/refresh-token`,
      {},
      { withCredentials: true }
    );
  }
}
