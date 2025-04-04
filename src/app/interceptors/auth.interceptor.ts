import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let accessToken = this.authService.getAccessToken();

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshAccessToken().pipe(
            switchMap((res) => {
              this.authService.setAccessToken(res.accessToken);
              return next.handle(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` },
                })
              );
            }),
            catchError(() => {
              this.authService.logout();
              return throwError(
                () => new Error('Session expirée, veuillez vous reconnecter.')
              );
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
