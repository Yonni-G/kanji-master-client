// game.service.ts
import { inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiGameService } from './api.game.service';
import { Card } from '../models/Card';
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

  private _cards: Card[] = [];
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

  currentCard(): Card | null {
    return this._cards[this._cardIndex] || null;
  }

  startGame(loadCardsCallback: () => void) {
    // si le jeu est deja lancé
    if (this._cardIndex > -1) {
      // on reset les données du game
      this.resetGame();
      // on recharge des cartes
      loadCardsCallback();
      return;
    }

    // on declenche le chronometre et on affiche la premiere carte
    this.startSubject.next();
    this._cardIndex++;
  }

  resetGame() {
    //this.loadClassicCards();
    // on arrete le chrono
    this.resetSubject.next();
  }

  // TODO : refacto les 2 fonctions ci-dessous
  loadClassicCards() {
    this.apiGameService.loadClassicCards().subscribe({
      next: (response: { cards: Card[] }) => {
        this._cards = response.cards;
        console.log(this._cards);

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

  loadReverseCards() {
    this.apiGameService.loadReverseCards().subscribe({
      next: (response: { cards: Card[] }) => {
        this._cards = response.cards;
        console.log(this._cards);

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
