// game.service.ts
import { inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiGameService } from './api.game.service';
import { ClassicCard } from '../models/ClassicCard';
import { ChronoService } from './chrono.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiGameService: ApiGameService = inject(ApiGameService);

  /* TODO : voir pour faire mieux pour gérer la dependance circulaire */
  private readonly injector = inject(Injector); // ✅ bonne syntaxe ici
  private _chronoService!: ChronoService;
  private get chronoService(): ChronoService {
    if (!this._chronoService) {
      this._chronoService = this.injector.get(ChronoService);
    }
    return this._chronoService;
  }

  private readonly startSubject = new Subject<void>();
  private readonly stopSubject = new Subject<void>();
  private readonly resetSubject = new Subject<void>();

  // on expose nos observables.
  start$ = this.startSubject.asObservable();
  stop$ = this.stopSubject.asObservable();
  reset$ = this.resetSubject.asObservable();

  private _cards: ClassicCard[] = [];
  private _cardIndex: number = -1;

  private _counters = {
    success: 0,
    errors: 0,
    total: 0,
  };

  POINTS_FOR_WINNING = 1;

  stats() {
    return this._counters;
  }

  checkAnswer(isCorrect: boolean) {
    this._cardIndex++;
    isCorrect ? this._counters.success++ : this._counters.errors++;
    this._counters.total++;

    // on verifie si la personne a gagné
    if (this._counters.success === this.POINTS_FOR_WINNING) {
      alert(this.chronoService.chrono);
      this.resetGame();
    }
  }

  currentCard(): ClassicCard | null {
    return this._cards[this._cardIndex] || null;
  }

  startGame() {
    // si le jeu est deja lancé
    if (this._cardIndex > -1) {
      // on reset le game
      this.resetGame();
      return;
    }

    // on declenche le chronometre et on affiche la premiere carte
    this.startSubject.next();
    this._cardIndex++;
  }

  stopGame() {
    this.stopSubject.next();
  }

  resetGame() {
    this.resetSubject.next();
    this.loadClassicCards();
  }

  loadClassicCards() {
    this.apiGameService.loadClassicCards().subscribe({
      next: (response: { cards: ClassicCard[] }) => {
        this._cards = response.cards;
        this._cardIndex = -1; // Réinitialiser l'index de la carte lors du chargement de nouvelles cartes
        this._counters = {
          success: 0,
          errors: 0,
          total: 0,
        };
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cartes classiques:', err);
        // Gérer l'erreur ici (affichage d'un message d'erreur ou autre)
      },
    });
  }
}
