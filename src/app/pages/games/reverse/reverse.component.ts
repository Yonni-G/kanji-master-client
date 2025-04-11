import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { Card } from '../../../models/Card';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-reverse',
  imports: [UpperCasePipe],
  templateUrl: './reverse.component.html',
  styleUrl: './reverse.component.css',

})
export class ReverseComponent {
  constructor(private readonly gameService: GameService) {}

  get card(): Card | null {
    return this.gameService.currentCard();
  }

  onCheck(isCorrect: boolean) {
    this.gameService.checkAnswer(isCorrect);
  }

  ngOnInit() {
    this.gameService.resetGame();
  }
}
