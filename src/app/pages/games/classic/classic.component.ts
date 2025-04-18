// classic.component.ts
import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { Card } from '../../../models/Card';
import { ChronoService } from '../../../services/chrono.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChronometerComponent } from "../../../components/games/chronometer/chronometer.component";
import { NgClass, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { GameMode } from '../../../models/GameMode';
import { ChronoFormatPipe } from '../../../pipes/chrono-format.pipe';
import { RankingComponent } from "../../../components/games/ranking/ranking.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ListErrorsComponent } from "../../../components/games/list-errors/list-errors.component";

@Component({
  selector: 'app-classic',
  imports: [
    UpperCasePipe,
    ChronometerComponent,
    ChronoFormatPipe,
    RankingComponent,
    NgClass,
    ListErrorsComponent
],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css',
})
export class ClassicComponent {
  classic = GameMode.CLASSIC;
  clickedChoiceIndex: number | null = null;

  private _time: number | null = null;
  authService = inject(AuthService);

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
    this.gameService.initGame(GameMode.CLASSIC);
    this.gameService.StopAndStartGame();
  }

  onCheck(choiceIndex: number, card: Card | null) {
    this.gameService.onCheck(choiceIndex, card!);
  }

  ngOnInit() {
    this.gameService.resetGame();
    //this.gameService.loadClassicCards();
  }
}
