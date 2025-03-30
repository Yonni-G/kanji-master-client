import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KmApiService {

    private readonly apiUrl = 'http://https://kanji-master-server.onrender.com/test'; // URL de l'API (change pour prod si nécessaire)

  constructor(private readonly http: HttpClient) { }

  // Méthode pour récupérer le message depuis la route /test
  getTestMessage(): Observable<any> {
    return this.http.get<any>(this.apiUrl); // Effectuer la requête GET
  }
}
