/* eslint-disable no-undef */
import 'phaser';
import { WorldScene } from '../Scenes/World';
import { BattleScene, UIScene } from '../Scenes/Battle';
import CreditsScene from '../Scenes/CreditsScene';

function engine() {
  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    dom: {
      createContainer: true,
    },
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true, // set to true to view zones
      },
    },
    scene: [
      WorldScene,
      BattleScene,
      CreditsScene,
      UIScene,
    ],
  };
  const game = new Phaser.Game(config);
  return game;
}

export default engine;
