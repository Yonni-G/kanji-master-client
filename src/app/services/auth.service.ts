import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly accessToken$: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(this.getStoredToken());

  private readonly username$: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(this.getStoredUsername());

  constructor() {
    this.loadUserFromStorage(); // Charger l'utilisateur dès l'initialisation
  }

  private loadUserFromStorage(): void {
    const storedToken = sessionStorage.getItem('accessToken');
    const storedUsername = sessionStorage.getItem('username');

    if (storedToken && storedUsername) {
      this.accessToken$.next(storedToken);
      this.username$.next(storedUsername);
    }
  }

  private getStoredToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  private getStoredUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  getAccessToken(): string | null {
    return this.accessToken$.value;
  }

  getUsername(): Observable<string | null> {
    return this.username$.asObservable();
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
        this.accessToken$.next(response.accessToken);
        this.username$.next(response.username);

        sessionStorage.setItem('accessToken', response.accessToken); // Stocke dans sessionStorage
        sessionStorage.setItem('username', response.username); // Stocke le nom d'utilisateur
      })
    );
  }

  logout(): void {
    this.apiService.logout().subscribe(() => {
      this.accessToken$.next(null);
      this.username$.next(null);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('username');
    });
  }
}
