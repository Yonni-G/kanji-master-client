import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./pages/partials/header/header.component";
import { FooterComponent } from "./pages/partials/footer/footer.component";
import { MessageComponent } from "./pages/partials/message/message.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // title = 'client';

  // kmApiService: KmApiService = inject(KmApiService)
  // ngOnInit(): void {
  //   this.kmApiService.getTestMessage().subscribe({
  //     next: (response) => {
  //       // Afficher l'alerte avec le message récupéré
  //       alert(response.message); // Ici on suppose que la réponse a une clé 'message'
  //     },
  //     error: (err) => {
  //       // Gérer les erreurs ici si la requête échoue
  //       console.error('Erreur lors de la récupération du message:', err);
  //     }
  //   });
  // }
}
