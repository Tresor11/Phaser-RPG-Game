/* eslint-disable no-undef */
import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');
    this.creditsText = this.add.text(0, 0, 'Credits', {
      fontSize: '32px',
      fill: '#fff',
    });
    this.madeByText = this.add.text(
      0,
      0,
      'Forest Clash created by Tresor Bireke',
      { fontSize: '26px', fill: '#B09B1C' },
    );
    this.explain1 = this.add.text(
      0,
      0,
      'This a game was created as a final project ',
      { fontSize: '26px', fill: '#fff' },
    );
    this.explain2 = this.add.text(
      0,
      0,
      'For the microverse javaScript Course',
      { fontSize: '26px', fill: '#fff' },
    );
    this.inspiration = this.add.text(0, 0, 'inspiration: GameDev Academy', {
      fontSize: '26px',
      fill: '#fff',
    });
    this.assets = this.add.text(0, 0, 'Asset: OpenGameArt', {
      fontSize: '26px',
      fill: '#fff',
    });
    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height,
    );

    [
      this.creditsText,
      this.madeByText,
      this.inspiration,
      this.assets,
      this.explain1,
      this.explain2,
    ].forEach((el) => {
      Phaser.Display.Align.In.Center(el, this.zone);
    });

    this.madeByText.setY(5);
    this.explain1.setY(50);
    this.explain2.setY(100);
    this.creditsText.setY(150);
    this.inspiration.setY(200);
  }
}
