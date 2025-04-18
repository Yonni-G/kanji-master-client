import { Component, inject } from '@angular/core';
import { CardError } from '../../../models/CardError';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-list-errors',
  imports: [],
  templateUrl: './list-errors.component.html',
  styleUrl: './list-errors.component.css',
})
export class ListErrorsComponent {
  //listErrors: CardError[] = [];

  gameService: GameService = inject(GameService);

  get listErrors() {
    return this.gameService.listErrors;
  }
}
