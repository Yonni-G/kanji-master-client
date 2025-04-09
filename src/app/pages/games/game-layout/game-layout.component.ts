import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-game-layout',
  imports: [RouterOutlet],
  templateUrl: './game-layout.component.html',
  styleUrl: './game-layout.component.css',
})
export class GameLayoutComponent {
  gameTitle = '';
  gameGoal = '';

  constructor(
    private readonly route: ActivatedRoute,
  ) {
    const childRoute = this.route.snapshot.firstChild;
    if (childRoute) {
      this.gameTitle = childRoute.data['gameTitle'];
      this.gameGoal = childRoute.data['gameGoal'];
    }
  }

}
