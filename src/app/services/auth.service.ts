import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService: ApiService = inject(ApiService);

  register(user: User): Observable<any> {
    return this.apiService.register(user);
  }

}
