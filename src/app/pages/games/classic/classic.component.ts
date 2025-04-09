// classic.component.ts
import { Component } from '@angular/core';
import { ChronometerComponent } from "../../../components/games/chronometer/chronometer.component";
import { GameService } from '../../../services/game.service';
import { ChronoService } from '../../../services/chrono.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpperCasePipe } from '@angular/common';
import { ClassicCard } from '../../../models/ClassicCard';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-classic',
  imports: [ChronometerComponent, UpperCasePipe, NgClass],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css',
})
export class ClassicComponent {
  private _time: number | null = null;

  classe: string | null = null;
  constructor(
    private readonly gameService: GameService,
    private readonly chronoService: ChronoService
  ) {
    this.chronoService.time$.pipe(takeUntilDestroyed()).subscribe((time) => {
      this._time = time;
    });
  }

  get card(): ClassicCard | null {
    return this.gameService.currentCard();
  }

  get pointsForWinning(): number | null {
    return this.gameService.POINTS_FOR_WINNING;
  }

  get counters() {
    return this.gameService.stats();
  }

  getClasses() {
    return "bouton-clicked";
  }
  onCheck(isCorrect: boolean) {
    this.classe = 'bouton-clicked';
    this.gameService.checkAnswer(isCorrect);
  }

  onStart() {
    this.gameService.startGame();
  }

  onStop() {
    this.gameService.stopGame();
  }

  onReset() {
    this.gameService.resetGame();
  }

  ngOnInit() {
    this.gameService.loadClassicCards();
  }
}
