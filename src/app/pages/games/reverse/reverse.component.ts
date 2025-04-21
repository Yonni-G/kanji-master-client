import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { Card } from '../../../models/Card';
import { UpperCasePipe } from '@angular/common';
import { ChronometerComponent } from "../../../components/games/chronometer/chronometer.component";
import { ChronoService } from '../../../services/chrono.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameMode } from '../../../models/GameMode';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reverse',
  imports: [UpperCasePipe, ChronometerComponent],
  templateUrl: './reverse.component.html',
  styleUrl: './reverse.component.css',
})
export class ReverseComponent {
  GameMode = GameMode;
  clickedChoiceIndex: number | null = null;

  private _time: number | null = null;
  authService = inject(AuthService);

  constructor(
    private readonly gameService: GameService,
    private readonly chronoService: ChronoService,
  
  ) {
    this.chronoService.time$.pipe(takeUntilDestroyed()).subscribe((time) => {
      this._time = time;
    });
  }

  get isLoading(): boolean {
    return this.gameService.isLoading;
  }

  get loadingCheckState(): string {
    return this.gameService.loadingCheckState;
  }

  get card(): Card | null {
    return this.gameService.card();
  }

  get counters() {
    return this.gameService.counters();
  }

  get userLiveChrono() {
    return this.gameService.userLiveChrono();
  }

  feedbackClass() {
    return this.gameService.feedbackClass();
  }

  onStart() {
    this.gameService.initGame(GameMode.REVERSE);
    this.gameService.StopAndStartGame();
  }

  onCheck(choiceIndex: number, card: Card | null) {
    this.gameService.onCheck(choiceIndex, card!);
  }

  ngOnInit() {
    this.gameService.resetGame();
    this.gameService.refreshRanking$.next();
  }
}
