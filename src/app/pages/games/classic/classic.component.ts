import { Component, ViewChild } from '@angular/core';
import { ChronometerComponent } from "../../../components/games/chronometer/chronometer.component";
import { ChronoFormatPipe } from '../../../pipes/chrono-format.pipe';

@Component({
  selector: 'app-classic',
  imports: [ChronometerComponent, ChronoFormatPipe],
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

  getChrono() {
    return this.chrono.getChrono();
  }

}
