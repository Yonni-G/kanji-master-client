import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

const KM_API_URL = environment.kmApiUrl; // URL de l'API pour le développement

@Injectable({
  providedIn: 'root'
})
export class KmApiService {

  constructor(private readonly http: HttpClient) { }

  // Méthode pour récupérer le message depuis la route /test
  getTestMessage(): Observable<any> {
    return this.http.get<any>(KM_API_URL); // Effectuer la requête GET
  }
}
