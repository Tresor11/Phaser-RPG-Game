/* eslint-disable no-undef */
export default class HealthBar {
  constructor(scene, x, y, value) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.value = value;
    this.p = 76 / 350;

    this.draw();

    scene.add.existing(this.bar);
  }

  decrease(amount) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return (this.value === 0);
  }

  draw() {
    this.bar.clear();

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, 80, 16);

    //  Health

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

    if (this.value < 50) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    const d = Math.floor(this.p * this.value);

    this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
  }
}