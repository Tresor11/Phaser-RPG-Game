/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.add.image(400, 300, 'fight');
    this.add.image(400, 100, 'axe');
    this.add.image(50, 500, 'arrow');
    this.add.image(50, 550, 'space');
    this.add.text(
      100,
      480,
      'Move and select',
      { fontSize: '26px', fill: '#B09B1C' },
    );
    this.add.text(
      100,
      530,
      'Confirm and attack ',
      { fontSize: '26px', fill: '#B09B1C' },
    );
    this.add.text(
      450,
      480,
      'Enemies are not visible 👻',
      { fontSize: '20px', fill: '#B09B1C' },
    );
    this.add.text(
      450,
      530,
      'Use the force to find them 🙏',
      { fontSize: '20px', fill: '#B09B1C' },
    );
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2 - 100,
      'blueButton1',
      'blueButton2',
      'Play',
      'WorldScene',
    );

    this.optionsButton = new Button(
      this,
      config.width / 2,
      config.height / 2,
      'blueButton1',
      'blueButton2',
      'Options',
      'Options',
    );

    this.creditsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 100,
      'blueButton1',
      'blueButton2',
      'Credits',
      'Credits',
    );

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }

  centerButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(
        config.width / 2,
        config.height / 2 - offset * 100,
        config.width,
        config.height,
      ),
    );
  }

  centerButtonText(gameText, gameButton) {
    Phaser.Display.Align.In.Center(gameText, gameButton);
  }
}
