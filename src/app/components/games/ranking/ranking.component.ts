import { Component, inject, Input, input } from '@angular/core';
import { GameMode } from '../../../models/GameMode';
import { ApiGameService } from '../../../services/api.game.service';
import { UserChrono } from '../../../models/userChrono';
import { ChronoFormatPipe } from '../../../pipes/chrono-format.pipe';
import { NgClass } from '@angular/common';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-ranking',
  imports: [ChronoFormatPipe, NgClass],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css',
})
export class RankingComponent {
  @Input() gameMode!: GameMode;

  userBestChrono: UserChrono | null = null;
  chronos: UserChrono[] | null = null;

  private readonly apiGameService = inject(ApiGameService);
  private readonly gameService = inject(GameService);

  ngOnInit() {
    this.loadRanking();
    this.gameService.refreshRanking$.subscribe(() => {
      this.loadRanking();
    });
  }

  loadRanking() {
    this.apiGameService.loadRanking(this.gameMode).subscribe(
      (data) => {
        this.userBestChrono = data.userBestChrono;
        this.chronos = data.chronos;
      },
      (error) => {
        console.error('Erreur lors du chargement du classement', error);
      }
    );
  }
}
