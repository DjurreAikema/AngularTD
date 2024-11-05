import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  template: `
    <canvas #gameCanvas width="800" height="600"></canvas>
    <div>
      <p>Enemies reached the center: {{ gameService.hitCounter }}</p>
      <p>Coins: {{ gameService.coins }}</p>
      <button (click)="upgradeDamage()">Increase Damage (Cost: 1 coin)</button>
      <button (click)="upgradeRange()">Increase Range (Cost: 1 coin)</button>
      <button (click)="upgradeFireRate()">Increase Fire Rate (Cost: 1 coin)</button>

      <h3>Current Tower Stats</h3>
      <p>Damage: {{ gameService.tower.damage }}</p>
      <p>Range: {{ gameService.tower.range }}</p>
      <p>Fire Rate: {{ gameService.tower.fireRate }} ms</p>
    </div>
  `,
  styles: [`
    canvas {
      border: 1px solid black;
    }
    div {
      margin-top: 10px;
    }
    button {
      margin-right: 5px;
    }
  `]
})
export class GameComponent implements AfterViewInit {

  public gameService: GameService = inject(GameService);

  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.ctx = this.gameCanvas.nativeElement.getContext('2d')!;
    this.startGameLoop();
  }

  startGameLoop() {
    window.requestAnimationFrame(() => this.updateGame());
  }

  updateGame() {
    this.ctx.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);

    // Update en teken vijanden
    this.gameService.updateEnemies();
    this.gameService.enemies.forEach(enemy => {
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(enemy.x, enemy.y, 20, 20);
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(`${enemy.health}`, enemy.x, enemy.y - 5);
    });

    // Update toren en teken deze
    this.gameService.updateTowers();
    const tower = this.gameService.tower;
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(tower.x - 10, tower.y - 10, 20, 20);

    // Update kogels en teken ze
    this.gameService.updateBullets();
    this.gameService.bullets.forEach(bullet => {
      this.ctx.fillStyle = 'black';
      this.ctx.beginPath();
      this.ctx.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
    });

    window.requestAnimationFrame(() => this.updateGame());
  }

  upgradeDamage(): void {
    this.gameService.upgradeDamage();
  }

  upgradeRange(): void {
    this.gameService.upgradeRange();
  }

  upgradeFireRate(): void {
    this.gameService.upgradeFireRate();
  }
}
