import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  message: string | null = null;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Abonnez-vous au message observable
    this.messageService.currentMessage.subscribe(message => {
      this.message = message;

      // Si un message est reçu, commencez un délai pour le supprimer
      if (message) {
        setTimeout(() => {
          this.message = null;
        }, 2000); // Disparaît après 5 secondes
      }
    });
  }
}
