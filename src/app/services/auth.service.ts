import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly jwtHelper: JwtHelperService = inject(JwtHelperService);

  private readonly accessToken$: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  private readonly username$: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  checkRefreshToken(): Observable<any> {
    return this.apiService.checkRefreshToken();
  }

  checkResetToken(resetToken: string): Observable<any> {
    return this.apiService.checkResetToken(resetToken);
  }

  test(): Observable<any> {
    return this.apiService.getTestMessage();
  }

  getUsernameFromToken(): string | null {
    const decodedToken = this.jwtHelper.decodeToken(
      sessionStorage.getItem('accessToken') || ''
    );
    return decodedToken ? decodedToken.username : null;
  }

  getUsername$(): Observable<string | null> {
    return this.username$.asObservable();
  }

  setUsername$(username: string): void {
    this.username$.next(username);
  }

  setAccessToken$(token: string): void {
    this.accessToken$.next(token);
  }

  register(user: User): Observable<any> {
    return this.apiService.register(user);
  }

  forgotPassword(user: User): Observable<any> {
    return this.apiService.forgotPassword(user);
  }

  login(user: User): Observable<any> {
    return this.apiService.login(user).pipe(
      tap((response) => {
        // Met à jour l'accessToken
        this.accessToken$.next(response.accessToken);
        // Stocke le token dans le sessionStorage
        sessionStorage.setItem('accessToken', response.accessToken);
        this.username$.next(this.getUsernameFromToken());
      })
    );
  }

  logout(): void {
    // on va supprimer le cookie http only refreshToken puis effacer le accessToken du sessionStorage, passer nos BehaviorSubject à null et rediriger vers la page de login
    this.apiService.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('accessToken');
        this.accessToken$.next(null);
        this.username$.next(null);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error.message, error);
      },
    });
  }

  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.apiService.resetPassword(token, password, confirmPassword);
  }
}
