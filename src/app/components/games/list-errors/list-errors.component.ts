import { Component, inject, Input } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { GameMode } from '../../../models/GameMode';

@Component({
  selector: 'app-list-errors',
  imports: [],
  templateUrl: './list-errors.component.html',
  styleUrl: './list-errors.component.css',
})
export class ListErrorsComponent {
  showErrors: boolean = false;
  @Input() gameMode: GameMode | null = null;
  gameService: GameService = inject(GameService);

  get listErrors() {
    return this.gameService.listErrors;
  }
}
