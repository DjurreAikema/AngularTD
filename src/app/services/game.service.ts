import { Injectable } from '@angular/core';
import { Enemy } from '../models/enemy.model';
import { Tower } from '../models/tower.model';

interface HitscanShot {
  x1: number; // Startpunt van de toren
  y1: number;
  x2: number; // Eindpunt bij de vijand
  y2: number;
  duration: number; // Tijd dat de lijn zichtbaar blijft
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  enemies: Enemy[] = [];
  tower: Tower;
  private spawnInterval: number = 100;
  private maxEnemies: number = 1000;
  public hitCounter: number = 0;
  public coins: number = 0;
  public hitscanShots: HitscanShot[] = []; // Lijst van huidige hitscan shots

  constructor() {
    this.tower = new Tower(400, 300, 500, 100, 25);
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
      const deltaX = this.tower.x - enemy.x;
      const deltaY = this.tower.y - enemy.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const moveX = (deltaX / distance) * enemy.speed;
      const moveY = (deltaY / distance) * enemy.speed;

      enemy.x += moveX;
      enemy.y += moveY;

      if (distance < 10) {
        this.hitCounter++;
        enemy.health = 0;
      }
    });

    this.enemies = this.enemies.filter(enemy => {
      if (enemy.health <= 0) {
        this.coins += 1;
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
        target.health -= this.tower.damage;
        if (target.health <= 0) {
          this.coins += 1;
        }

        // Voeg een hitscan shot toe aan de lijst voor visualisatie
        this.hitscanShots.push({
          x1: this.tower.x,
          y1: this.tower.y,
          x2: target.x,
          y2: target.y,
          duration: 5 // De hitscan-lijn is zichtbaar voor 5 frames
        });
      }
    }

    // Verwijder hitscan shots die verlopen zijn
    this.hitscanShots = this.hitscanShots.filter(shot => shot.duration-- > 0);
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

  upgradeDamage(): void {
    if (this.coins >= 1) {
      this.coins--;
      this.tower.damage += 5;
    }
  }

  upgradeRange(): void {
    if (this.coins >= 1) {
      this.coins--;
      this.tower.range += 20;
    }
  }

  upgradeFireRate(): void {
    if (this.coins >= 1) {
      this.coins--;
      this.tower.fireRate = Math.max(100, this.tower.fireRate - 100); // Verlaag de vuursnelheid (limiet van minimaal 100 ms)
    }
  }
}
