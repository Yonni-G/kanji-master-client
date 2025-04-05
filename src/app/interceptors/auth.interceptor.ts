import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        // Récupération du token depuis le sessionStorage
        const token = sessionStorage.getItem('accessToken');

        // Optionnel : exclure certaines URL comme /login ou /register
        if (req.url.includes('/login') || req.url.includes('/register')) {
            return next.handle(req); // ne rien faire, passer la requête telle quelle
        }

        // S'il y a un token, on clone la requête en y ajoutant l'en-tête Authorization
        const authReq = token
            ? req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
            : req;

        return next.handle(authReq).pipe(
            //catchError((error: HttpErrorResponse) => {
                // Tu peux gérer ici les erreurs comme les 401, redirections, etc.
                //console.error('Erreur HTTP interceptée:', error);
                //alert('Erreur HTTP interceptée:');
                //return throwError(() => error);
            //})
        );
    }
}
