/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('master', 'assets/mater.png');
    this.load.audio('bgMusic', 'assets/TownTheme.mp3');
  }

  create() {
    this.scene.start('Preloader');
  }
}
