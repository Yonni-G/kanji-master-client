import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  // on interroge l'api pour savoir si le refreshToken existe et est valide
  checkRefreshToken(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/users/check-refresh-token`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  // on interroge l'api pour savoir si le resetoken existe et est valide
  checkResetToken(resetToken: string): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/users/check-reset-token`, { resetToken },{
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  // Méthode pour récupérer le message depuis la route /test
  getTestMessage(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/users/test`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  getTestProtected(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/users/protected`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  forgotPassword(user: User): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/users/forgot-password`, user, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  register(user: User): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/users/register`, user, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  login(user: User): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/users/login`, user, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  // Méthode pour se déconnecter
  logout(): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiUrl}/users/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }

  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiUrl}/users/reset-password`,
        { token, password, confirmPassword },
        { withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }

  // Gérer les erreurs globales
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      // Si le token est expiré ou invalide, on pourrait essayer de rafraîchir le token
      // C'est ici que tu pourrais gérer la logique de rafraîchissement dans ton service
      console.error('Token expiré ou invalide', error);
    }
    return throwError(
      () => new Error(error.message || 'Une erreur est survenue')
    );
  }
}
