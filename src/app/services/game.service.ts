import {Injectable} from '@angular/core';
import {Enemy} from '../models/enemy.model';
import {Tower} from '../models/tower.model';
import {Bullet} from '../models/bullet.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  enemies: Enemy[] = [];
  tower: Tower;
  bullets: Bullet[] = [];
  private spawnInterval: number = 1000;
  private maxEnemies: number = 30;
  public hitCounter: number = 0;
  public coins: number = 10;

  constructor() {
    this.tower = new Tower(400, 300, 150, 1000, 20);
    this.startSpawningEnemies();
  }

  private startSpawningEnemies(): void {
    setInterval(() => {
      if (this.enemies.length < this.maxEnemies) {
        this.spawnEnemy();
      }
    }, this.spawnInterval);
  }

  private spawnEnemy(): void {
    // Spawnen van een vijand aan een willekeurige rand van het canvas
    const edge = Math.floor(Math.random() * 4);
    let x, y;

    switch (edge) {
      case 0: // Bovenkant
        x = Math.random() * 800;
        y = 0;
        break;
      case 1: // Onderkant
        x = Math.random() * 800;
        y = 600;
        break;
      case 2: // Linkerkant
        x = 0;
        y = Math.random() * 600;
        break;
      case 3: // Rechterkant
        x = 800;
        y = Math.random() * 600;
        break;
    }

    const newEnemy = new Enemy(x!, y!, 1, 100);
    this.enemies.push(newEnemy);
  }

  updateEnemies(): void {
    this.enemies.forEach(enemy => {
      // Beweeg vijand naar het midden van het canvas (de toren)
      const deltaX = this.tower.x - enemy.x;
      const deltaY = this.tower.y - enemy.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const moveX = (deltaX / distance) * enemy.speed;
      const moveY = (deltaY / distance) * enemy.speed;

      enemy.x += moveX;
      enemy.y += moveY;

      // Controleer of vijand het centrum heeft bereikt
      if (distance < 10) {
        this.hitCounter++;
        enemy.health = 0; // Verwijder vijand
      }
    });

    // Verwijder vijanden met gezondheid minder dan of gelijk aan 0 en geef munt
    this.enemies = this.enemies.filter(enemy => {
      if (enemy.health <= 0) {
        this.coins += 1;  // Voeg een munt toe als de vijand is verslagen
        return false;
      }
      return true;
    });
  }

  updateTowers(): void {
    if (this.tower.canFire()) {
      const target = this.findTargetInRange(this.tower);
      if (target) {
        this.tower.fire();
        this.spawnBullet(this.tower, target);
      }
    }
  }

  private findTargetInRange(tower: Tower): Enemy | null {
    for (const enemy of this.enemies) {
      const distance = Math.sqrt((tower.x - enemy.x) ** 2 + (tower.y - enemy.y) ** 2);
      if (distance <= tower.range) {
        return enemy;
      }
    }
    return null;
  }

  private spawnBullet(tower: Tower, target: Enemy): void {
    const bullet = new Bullet(tower.x, tower.y, 5, tower.damage, target);
    this.bullets.push(bullet);
  }

  updateBullets(): void {
    this.bullets.forEach(bullet => {
      bullet.move();
      if (bullet.hasHitTarget()) {
        bullet.target.health -= bullet.damage;
        // Verwijder de kogel als deze het doelwit raakt
        this.bullets = this.bullets.filter(b => b !== bullet);
      }
    });
  }

  // Methods to upgrade the tower using coins
  upgradeDamage(): void {
    if (this.coins >= 1) {
      this.coins--;
      this.tower.damage += 5;
    }
  }

  upgradeRange(): void {
    if (this.coins >= 1) {
      this.coins--;
      this.tower.range += 10;
    }
  }

  upgradeFireRate(): void {
    if (this.coins >= 1) {
      this.coins--;
      this.tower.fireRate = Math.max(100, this.tower.fireRate - 100);
    }
  }
}
