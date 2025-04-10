// classic.component.ts
import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { UpperCasePipe } from '@angular/common';
import { Card } from '../../../models/Card';

@Component({
  selector: 'app-classic',
  imports: [UpperCasePipe],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css',

})
export class ClassicComponent {
  constructor(private readonly gameService: GameService) {}

  get card(): Card | null {
    return this.gameService.currentCard();
  }

  onCheck(isCorrect: boolean) {
    this.gameService.checkAnswer(isCorrect);
  }

  ngOnInit() {
    this.gameService.resetGame();
    this.gameService.loadClassicCards();
  }
}
