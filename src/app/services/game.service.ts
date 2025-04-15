// game.service.ts
import { ChangeDetectorRef, inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiGameService } from './api.game.service';
import { Card } from '../models/Card';
import { ChronoService } from './chrono.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

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
  _gameId = '';

  // PUBLIC
  // on expose nos observables.
  start$ = this.startSubject.asObservable();
  stop$ = this.stopSubject.asObservable();
  reset$ = this.resetSubject.asObservable();
  // --
  isLoading: boolean = false;
  POINTS_FOR_WINNING = 5;
  // Nombre de cartes minimum à partir duquel à va recharger des cartes
  LOW_CARDS_FROM = 5;

  constructor(private readonly router: Router) {}

  startGame(gameId: string) {
    this._gameId = gameId;
    // Si le jeu est déjà lancé => on reset
    if (this._cardIndex > -1) {
      this.resetGame();
      return;
    }

    this.isLoading = true;
    this.loadCards(gameId, () => {
      this.isLoading = false;
      this.startSubject.next(); // Démarrer le chrono
      this._nextCard();
    });
  }

  onCheck(isCorrect: boolean) {
    this._nextCard();
    isCorrect ? this._counters.success++ : this._counters.errors++;
    this._counters.total++;

    // on verifie si la personne a gagné
    if (this._counters.success === this.POINTS_FOR_WINNING) {
      //alert(this.chronoService.chrono);
      this.resetGame();
      return;
    }
    // reste-t-il assez de cartes à deviner ?
    console.log(
      'index : ' + this._cardIndex + ', taille de cards : ' + this._cards.length
    );
    if (this._cardIndex + this.LOW_CARDS_FROM > this._cards.length) {
      console.log('on recharge');
      this.loadCards(this._gameId);
    }
  }

  // chargement de cartes avec callback optionnel
  loadCards(typeOfCard: string, onLoaded?: () => void) {
    this.apiGameService.loadCards(typeOfCard).subscribe({
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

  currentCard(): Card | null {
    return this._cards[this._cardIndex] || null;
  }
}
