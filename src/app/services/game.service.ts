// game.service.ts
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiGameService } from './api.game.service';
import { Card } from '../models/Card';
import { GameMode } from '../models/GameMode';
import { UserChrono } from '../models/userChrono';
import { CardError } from '../models/CardError';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiGameService: ApiGameService = inject(ApiGameService);

  private readonly startSubject = new Subject<void>();
  private readonly stopSubject = new Subject<void>();
  private readonly resetSubject = new Subject<void>();

  refreshRanking$ = new Subject<void>();
  openModale$ = new Subject<void>();

  private _counters = {
    success: 0,
    errors: 0,
    total: 0,
  };

  private _gameMode!: GameMode;
  private _gameToken: string | null = null;
  private _card: Card | null = null;
  private _listErrors: CardError[] = [];
  listErrors: CardError[] = [];
  private _userLiveChrono: UserChrono | null = null;
  private _feedbackClass: string = '';

  start$ = this.startSubject.asObservable();
  stop$ = this.stopSubject.asObservable();
  reset$ = this.resetSubject.asObservable();

  isLoading: boolean = false;
  loadingCheckState: string = 'disabled';

  initGame(gameMode: GameMode) {
    this._gameMode = gameMode;
    this._userLiveChrono = null;
  }

  get gameMode(): GameMode {
    return this._gameMode;
  }

  onCheck(choiceIndex: number, card: Card) {
    this.loadingCheckState = 'enabled';
    setTimeout(() => {
      this.apiGameService
        .checkAnswer(this._gameMode, this._gameToken!, choiceIndex)
        .subscribe({
          next: (response) => {
            this._counters.total++;

            if (response.chronoValue) {
              this._userLiveChrono = response;
              this.refreshRanking$.next();
              this.stopSubject.next();
              this.loadingCheckState = 'disabled';
              this.listErrors = this._listErrors;
              this.openModale$.next();
<<<<<<< Updated upstream
              
=======
>>>>>>> Stashed changes
              return;
            }

            this._gameToken = response.gameToken;

            if (response.correct) {
              this._counters.success++;
              this._feedbackClass = 'correctAnswer';
            } else {
              this._counters.errors++;
              this._feedbackClass = 'unCorrectAnswer';
              this._listErrors.push({
                proposal: card?.proposal,
                correct: card?.choices[response.correctIndex].label,
                unCorrect: card?.choices[choiceIndex].label,
              });
<<<<<<< Updated upstream
              console.log(this._listErrors);
=======
>>>>>>> Stashed changes
            }

            this.loadingCheckState = 'masquer les boutons';
            setTimeout(() => {
              this.isLoading = false;
              this._card = response.card;
              this._feedbackClass = '';
              this.loadingCheckState = 'disabled';
            }, 400);
          },
          error: (err) => {
            console.error('Erreur lors du contrôle de la réponse', err);
            this.isLoading = false;
          },
        });
    }, 200);
  }

  // fonction qui va réinitialiser les données d'affichage post-partie
  resetPostGameDatas() {
    // on masque le dernier chrono
    this._userLiveChrono = null;
    // on reinit les tableaux d'erreurs
    this._listErrors = [];
    this.listErrors = [];
  }

  StopAndStartGame() {
    if (this._card) {
      this.resetGame();
      return;
    }

<<<<<<< Updated upstream
    this.resetPostGameDatas();

    // on démarre le jeu et en retour on obtient une carte
=======
    if (!this._gameMode) {
      throw new Error('Game mode must be initialized before starting the game');
    }

    this._userLiveChrono = null;
    this._listErrors = [];
    this.listErrors = [];
>>>>>>> Stashed changes
    this.isLoading = true;
    this.startGame(() => {
      this.isLoading = false;
      this.startSubject.next();
    });
  }

  startGame(onLoaded?: () => void) {
    if (!this._gameMode) {
      throw new Error('Game mode must be initialized before starting the game');
    }

    console.log('[startGame] Lancement avec', this._gameMode);
    this.apiGameService.startGame(this._gameMode).subscribe({
      next: (response) => {
        this._card = response.card;
        this._gameToken = response.gameToken;
        if (onLoaded) onLoaded();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cartes classiques:', err);
      },
    });
  }

  resetGame() {    
    this.resetSubject.next();
    this._card = null;
    this._counters = {
      success: 0,
      errors: 0,
      total: 0,
    };
  }

  counters() {
    return this._counters;
  }

  card(): Card | null {
    return this._card || null;
  }

  userLiveChrono(): UserChrono | null {
    return this._userLiveChrono;
  }

  feedbackClass() {
    return this._feedbackClass;
  }
}
