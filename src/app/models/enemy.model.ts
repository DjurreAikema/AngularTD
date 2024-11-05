export class Enemy {
  x: number;
  y: number;
  speed: number;
  health: number;

  constructor(x: number, y: number, speed: number, health: number) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.health = health;
  }

  move() {
    this.x += this.speed;
  }
}
