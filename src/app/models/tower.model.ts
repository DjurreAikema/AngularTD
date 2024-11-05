export class Tower {
  x: number;
  y: number;
  range: number;
  fireRate: number;
  damage: number;
  lastFired: number;

  constructor(x: number, y: number, range: number, fireRate: number, damage: number) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.fireRate = fireRate;
    this.damage = damage;
    this.lastFired = Date.now();
  }

  canFire(): boolean {
    const currentTime = Date.now();
    return (currentTime - this.lastFired) >= this.fireRate;
  }

  fire(): void {
    this.lastFired = Date.now();
  }
}
