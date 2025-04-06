import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private readonly authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

     // ⛔️ Ignore l'appel à /api/refresh-token
  if (
    req.url.includes('/check-refresh-token') ||
    req.url.includes('/check-reset-token') ||
    req.url.includes('/login') ||
    req.url.includes('/logout') ||
    req.url.includes('/reset-password')
  ) {
    return next.handle(req);
  }

    const accessToken = this.authService.getAccessTokenFromStorage();

    // Clone la requête et ajoute le header Authorization si le token existe
    const authReq = accessToken
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.isRefreshing
        ) {
          this.isRefreshing = true;
          return this.authService.checkRefreshToken().pipe(
            switchMap((response:    any) => {
              this.authService.setAccessToken$(response.accessToken);
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });
              this.isRefreshing = false;
              return next.handle(newReq);
            }),
            catchError((err) => {
              this.isRefreshing = false;
              this.authService.logout(); // supprime le token et redirige
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
