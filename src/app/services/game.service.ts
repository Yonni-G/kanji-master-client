// game.service.ts
import { ChangeDetectorRef, inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiGameService } from './api.game.service';
import { Card } from '../models/Card';
import { ChronoService } from './chrono.service';
import { Router } from '@angular/router';

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

  private _cards: Card[] = [];
  private _cardIndex: number = -1;

  private _counters = {
    success: 0,
    errors: 0,
    total: 0,
  };

  // PUBLIC
  // on expose nos observables.
  start$ = this.startSubject.asObservable();
  stop$ = this.stopSubject.asObservable();
  reset$ = this.resetSubject.asObservable();
  // --
  isLoading: boolean = false;
  POINTS_FOR_WINNING = 5;

  constructor(private readonly router: Router) {}
  startGame(gameId: string) {
    // Si le jeu est déjà lancé => on reset
    if (this._cardIndex > -1) {
      this.resetGame();
      return;
    }

    // Fonction générique pour démarrer le jeu
    const loadCardsAndStartGame = (
      loadCards: (callback: () => void) => void
    ) => {
      this.isLoading = true;
      loadCards(() => {
        this.isLoading = false;
        this.startSubject.next(); // Démarrer le chrono
        this._nextCard();
      });
    };

    if (gameId === 'classic') {
      loadCardsAndStartGame(this.loadClassicCards.bind(this)); // Bind pour le contexte
    } else if (gameId === 'reverse') {
      loadCardsAndStartGame(this.loadReverseCards.bind(this)); // Bind pour le contexte
    }
  }

  // TODO : refacto les 2 fonctions ci-dessous
  loadClassicCards(onLoaded?: () => void) {
    this.apiGameService.loadClassicCards().subscribe({
      next: (response: { cards: Card[] }) => {
        this._cards = this._cards.concat(response.cards);
        console.log(this._cards);
        if (onLoaded) onLoaded();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cartes classiques:', err);
      },
    });
  }

  loadReverseCards(onLoaded?: () => void) {
    this.apiGameService.loadReverseCards().subscribe({
      next: (response: { cards: Card[] }) => {
        this._cards = this._cards.concat(response.cards);
        console.log(this._cards);
        if (onLoaded) onLoaded();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cartes inversées:', err);
      },
    });
  }

  resetGame() {
    // on arrete le chrono
    this.resetSubject.next();

    // on réinitialise les données du jeu
    this._cards = [];
    this._cardIndex = -1; // Réinitialiser l'index de la carte lors du chargement de nouvelles cartes
    this._counters = {
      success: 0,
      errors: 0,
      total: 0,
    };
  }

  stats() {
    return this._counters;
  }

  private _nextCard() {
    this._cardIndex++;
  }

  onCheck(isCorrect: boolean) {
    this._nextCard();
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
}
