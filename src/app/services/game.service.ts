// game.service.ts
import { inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiGameService } from './api.game.service';
import { Card } from '../models/Card';
import { ChronoService } from './chrono.service';
import { Router } from '@angular/router';
import { GameMode } from '../models/GameMode';

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

  private _counters = {
    success: 0,
    errors: 0,
    total: 0,
  };
  private _gameMode: GameMode = GameMode.CLASSIC;
  private _gameToken: string | null = null;
  private _card: Card | null = null;

  // PUBLIC
  // on expose nos observables.
  start$ = this.startSubject.asObservable();
  stop$ = this.stopSubject.asObservable();
  reset$ = this.resetSubject.asObservable();
  // --
  isLoading: boolean = false;

  constructor(private readonly router: Router) {}

  initGame(gameMode: GameMode) {
    this._gameMode = gameMode;
  }

  onCheck(choiceIndex: number) {
    // on va interroger notre api en lui passant :
    // - le choix du joueur (choiceIndex)
    // - le gameToken
    // ce dernier nous dira si oui ou non la reponse est bonne et il nous renverra une nouvelle response (token + card)
    this.apiGameService
      .checkAnswer(this._gameMode, this._gameToken!, choiceIndex)
      .subscribe({
        next: (response) => {
          
          // on checke une eventuelle victoire
          if(response.chrono) {
            alert('you win ' + response.chrono);
            this.resetGame();
            return;
          }
          
          this._card = response.card;
          this._gameToken = response.gameToken;
          if (response.correct) this._counters.success++;
          else this._counters.errors++;
        },
        error: (err) => {
          console.error('Erreur lors du contrôle de la réponse', err);
        },
      });
    this._counters.total++;
  }

  StopAndStartGame() {
    // Si le jeu est déjà lancé => on reset
    if (this._card) {
      this.resetGame();
      return;
    }

    // on démarre le jeu et en retour on obtient une carte

    this.isLoading = true;
    this.startGame(this._gameMode, () => {
      this.isLoading = false;
      this.startSubject.next(); // Démarrer le chrono
      //this._nextCard();
    });
  }

  // chargement de cartes avec callback optionnel
  startGame(gameMode: GameMode, onLoaded?: () => void) {
    this.apiGameService.startGame(gameMode).subscribe({
      next: (response) => {
        this._card = response.card;
        this._gameToken = response.gameToken;
        console.log(this._gameToken);
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
    this._card = null;
    this._counters = {
      success: 0,
      errors: 0,
      total: 0,
    };
  }

  // accesseurs
  counters() {
    return this._counters;
  }

  card(): Card | null {
    return this._card || null;
  }
}
