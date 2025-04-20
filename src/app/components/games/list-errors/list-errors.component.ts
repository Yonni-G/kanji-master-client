import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-list-errors',
  imports: [],
  templateUrl: './list-errors.component.html',
  styleUrl: './list-errors.component.css',
})
export class ListErrorsComponent {
  showErrors: boolean = false;

  gameService: GameService = inject(GameService);

  get listErrors() {
    return this.gameService.listErrors;
  }
}
