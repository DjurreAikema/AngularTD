import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GameComponent} from './components/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent],
  template: `
    <app-game/>
  `,
  styles: [],
})
export class AppComponent {
  title = 'AngularTD';
}
