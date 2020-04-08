/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */

import 'phaser';
import { score } from './Battle';
import { scoreTextUpdate, levelUpdate } from './helper';

let scoreText;
let levelText;
class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
  }

  create() {
    const map = this.add.image(400, 300, 'map');

    const trees = this.physics.add.staticGroup();
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.RND.between(0, 800);
      const y = Phaser.Math.RND.between(0, 600);
      const id = Phaser.Math.RND.between(1, 2);
      trees.create(x, y, `tree${id}`);
    }
    scoreText = this.add.text(16, 16, `Score : ${score}`, {
      fontSize: '32px',
      fill: '#000',
    });

    levelText = this.add.text(16, 50, 'Level :1', {
      fontSize: '32px',
      fill: '#000',
    });
    scoreTextUpdate(scoreText);
    levelUpdate(levelText);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });


    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [2, 8, 2, 14],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [0, 6, 0, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });


    this.player = this.physics.add.sprite(50, 100, 'player', 6);
    this.physics.add.collider(this.player, trees);

    this.player.setCollideWorldBounds(true);


    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.roundPixels = true;


    this.cursors = this.input.keyboard.createCursorKeys();


    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

      this.spawns.create(x, y, 20, 20);
    }

    this.physics.add.overlap(
      this.player,
      this.spawns,
      this.onMeetEnemy,
      false,
      this,
    );

    this.sys.events.on('wake', this.wake, this);
  }

  wake() {
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  }

  onMeetEnemy(player, zone) {
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    scoreText.setText(`Score: ${score}`);

    this.cameras.main.shake(300);

    this.input.stopPropagation();

    this.scene.switch('BattleScene');
  }

  update(time, delta) {
    this.player.body.setVelocity(0);


    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }

    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }


    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true);
      this.player.flipX = false;
    } else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }
  }
}

export { WorldScene };
