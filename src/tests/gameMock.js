import 'phaser';
import liveUpdate from './dom';
import config from './Config/config';
import { WorldScene } from './Scenes/World';
import { BattleScene, UIScene } from './Scenes/Battle';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import Model from './Objects/Model';
import GameOver from './Scenes/GameOver';

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
      liveUpdate,
    ],
  };
}
