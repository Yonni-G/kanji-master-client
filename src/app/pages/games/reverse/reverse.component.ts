import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { Card } from '../../../models/Card';
import { NgClass, UpperCasePipe } from '@angular/common';
import { ChronometerComponent } from "../../../components/games/chronometer/chronometer.component";
import { ChronoService } from '../../../services/chrono.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameMode } from '../../../models/GameMode';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reverse',
  imports: [UpperCasePipe, ChronometerComponent, NgClass],
  templateUrl: './reverse.component.html',
  styleUrl: './reverse.component.css',
})
export class ReverseComponent {
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

  get card(): Card | null {
    return this.gameService.card();
  }

  get counters() {
    return this.gameService.counters();
  }

  onStart() {
    this.gameService.initGame(GameMode.REVERSE);
    this.gameService.StopAndStartGame();
  }

  onCheck(choiceIndex: number, card: Card) {
    this.gameService.onCheck(choiceIndex, card);
  }

  ngOnInit() {
    this.gameService.resetGame();
    //this.gameService.loadClassicCards();
  }
}
