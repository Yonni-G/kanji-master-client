import { AfterViewChecked, Component, DestroyRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ChronometerComponent } from '../../../components/games/chronometer/chronometer.component';
import { GameService } from '../../../services/game.service';
import { ChronoService } from '../../../services/chrono.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Card } from '../../../models/Card';
import { filter } from 'rxjs';

@Component({
  selector: 'app-game-layout',
  imports: [RouterOutlet, ChronometerComponent],
  templateUrl: './game-layout.component.html',
  styleUrl: './game-layout.component.css',
})
export class GameLayoutComponent  {
  gameTitle = '';
  gameDescription = '';
  private _gameName: 'classic' | 'reverse' = 'classic';

  private _time: number | null = null;

  constructor(
    private readonly gameService: GameService,
    private readonly chronoService: ChronoService,
    private readonly route: ActivatedRoute,
    private readonly destroyRef: DestroyRef, // Injection du DestroyRef
    private readonly router: Router
  ) {
    this.chronoService.time$.pipe(takeUntilDestroyed()).subscribe((time) => {
      this._time = time;
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const childData = this.route.snapshot.firstChild?.data;
        if (childData) {
          this.gameTitle = childData['gameTitle'];
          this.gameDescription = childData['gameDescription'];
          this._gameName = childData['gameName'];
        }
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
    this.gameService.startGame((onLoaded) => {
      if (this._gameName === 'classic') {
        this.gameService.loadClassicCards(onLoaded);
      } else {
        this.gameService.loadReverseCards(onLoaded);
      }
    });
  }
}
