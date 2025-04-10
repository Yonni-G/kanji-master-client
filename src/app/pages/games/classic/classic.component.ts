import { Component, ViewChild } from '@angular/core';
import { ChronometerComponent } from "../../../components/games/chronometer/chronometer.component";

@Component({
  selector: 'app-classic',
  imports: [ChronometerComponent],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css',
})
export class ClassicComponent {
  @ViewChild(ChronometerComponent) chrono!: ChronometerComponent;

  startGame() {
    this.chrono.startGame();
  }

  stopGame() {
    this.chrono.stopGame();
  }

  reset() {
    this.chrono.reset();
  }

}
