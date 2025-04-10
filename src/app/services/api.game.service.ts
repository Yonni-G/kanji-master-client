import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiGameService {
  constructor(private readonly http: HttpClient) {}

  loadClassicCards(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/games/cards/classic`);
  }

  loadReverseCards(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/games/cards/reverse`);
  }
}
