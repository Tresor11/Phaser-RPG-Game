/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    this.add.image(400, 200, 'master');
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);


    this.load.on('progress', (value) => {
      percentText.setText(`${parseInt(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });


    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });


    this.load.on(
      'complete',
      () => {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
        this.ready();
      },
    );

    this.timedEvent = this.time.delayedCall(5000, this.ready, [], this);


    this.load.image('blueButton1', 'assets/ui/button1.png');
    this.load.image('blueButton2', 'assets/ui/button2.png');
    this.load.image('box', 'assets/ui/sound6.png');
    this.load.image('checkedBox', 'assets/ui/sound3.png');
    this.load.audio('bgMusic', 'assets/TownTheme.mp3');
    this.load.audio('select', 'assets/bfxr_sounds/Blip_Select.mp3');
    this.load.audio('attack', 'assets/bfxr_sounds/Explosion2.mp3');
    this.load.audio('win', 'assets/bfxr_sounds/Powerup.mp3');

    this.load.image('tree2', 'assets/map/tree1.png');
    this.load.image('tree1', 'assets/map/tree2.png');


    this.load.image('map', 'assets/map/fancy-court.png.png');

    this.load.spritesheet('player', 'assets/RPG_assets.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet('player2', 'assets/hero1.png', {
      frameWidth: 105,
      frameHeight: 110,
    });

    this.load.image('hero1', 'assets/ninja.png');
    this.load.image('hero2', 'assets/super.png');
    this.load.image('wizarus1', 'assets/wizard1.png');
    this.load.image('wizarus2', 'assets/wizard2.png');
    this.load.image('wizarus3', 'assets/wizard3.png');
    this.load.image('ghostus', 'assets/ghost.png');
    this.load.image('master', 'assets/mater.png');
  }

  ready() {
    this.scene.start('Title');
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
}
