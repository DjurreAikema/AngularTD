import {Enemy} from './enemy.model';

export class Bullet {
  x: number;
  y: number;
  speed: number;
  damage: number;
  target: Enemy;

  constructor(x: number, y: number, speed: number, damage: number, target: Enemy) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.damage = damage;
    this.target = target;
  }

  move() {
    const deltaX = this.target.x - this.x;
    const deltaY = this.target.y - this.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const moveX = (deltaX / distance) * this.speed;
    const moveY = (deltaY / distance) * this.speed;

    this.x += moveX;
    this.y += moveY;
  }

  hasHitTarget(): boolean {
    const distance = Math.sqrt((this.target.x - this.x) ** 2 + (this.target.y - this.y) ** 2);
    return distance < 5;
  }
}
