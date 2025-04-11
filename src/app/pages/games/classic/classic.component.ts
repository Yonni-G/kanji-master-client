// classic.component.ts
import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { Card } from '../../../models/Card';
import { ChronoService } from '../../../services/chrono.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChronometerComponent } from "../../../components/games/chronometer/chronometer.component";
import { NgClass, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-classic',
  imports: [UpperCasePipe, ChronometerComponent, NgClass],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css',
})
export class ClassicComponent {
  private _time: number | null = null;

  constructor(
    private readonly gameService: GameService,
    private readonly chronoService: ChronoService,
    private readonly route: ActivatedRoute
  ) {
    this.chronoService.time$.pipe(takeUntilDestroyed()).subscribe((time) => {
      this._time = time;
    });
  }

  get isLoading(): boolean {
    return this.gameService.isLoading;
  }

  get card(): Card | null {
    return this.gameService.currentCard();
  }

  get pointsForWinning(): number | null {
    return this.gameService.POINTS_FOR_WINNING;
  }

  get counters() {
    return this.gameService.stats();
  }

  onStart() {
    this.gameService.startGame('classic');
  }

  onCheck(isCorrect: boolean) {
    this.gameService.onCheck(isCorrect);
  }

  ngOnInit() {
    this.gameService.resetGame();
    //this.gameService.loadClassicCards();
  }
}
