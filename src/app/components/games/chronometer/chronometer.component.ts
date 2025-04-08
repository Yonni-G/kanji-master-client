import { Component } from '@angular/core';

@Component({
  selector: 'app-chronometer',
  templateUrl: './chronometer.component.html',
  styleUrls: ['./chronometer.component.css'],
})
export class ChronometerComponent {
  minutes = 0;
  secondes = 0;
  centiemes = 0;
  intervalId: any;
  enCours = false;

  startGame() {
    if (!this.enCours) {
      this.enCours = true;
      this.intervalId = setInterval(() => {
        this.centiemes++;
        if (this.centiemes >= 100) {
          this.centiemes = 0;
          this.secondes++;
          if (this.secondes >= 60) {
            this.secondes = 0;
            this.minutes++;
          }
        }
      }, 10);
    }
  }

  stopGame() {
    this.enCours = false;
    clearInterval(this.intervalId);
  }

  reset() {
    this.stopGame();
    this.minutes = 0;
    this.secondes = 0;
    this.centiemes = 0;
  }

  get affichageTemps(): string {
    const m = this.minutes.toString().padStart(2, '0');
    const s = this.secondes.toString().padStart(2, '0');
    const c = this.centiemes.toString().padStart(2, '0');
    return `${m}:${s}:${c}`;
  }

  getChrono(): number {
    return this.minutes * 60 + this.secondes + this.centiemes / 100;
  }
}
