/* eslint-disable import/no-cycle */
/* eslint-disable no-multi-assign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
import 'phaser';

import {
  scoreUpdate, powerAssign, enemySelect,
} from './helper';

const BattleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function BattleScene() {
    Phaser.Scene.call(this, { key: 'BattleScene' });
  },
  create() {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();

    this.sys.events.on('wake', this.startBattle, this);
  },
  startBattle() {
    const warrior = new PlayerCharacter(
      this,
      500,
      150,
      'hero1',
      null,
      'Ninja',
      150,
      80,
    );
    this.add.existing(warrior);


    const mage = new PlayerCharacter(
      this,
      500,
      300,
      'hero2',
      null,
      'Herus',
      200,
      50,
    );
    this.add.existing(mage);

    const dragonblue = new Enemy(
      this,
      250,
      150,
      'bandit',
      Phaser.Math.RND.between(0, 2),
      'drangon',
      200,
    );
    this.add.existing(dragonblue);

    const dragonOrange = new Enemy(
      this,
      250,
      300,
      'bandit',
      Phaser.Math.RND.between(0, 2),
      'bandit',
      200,
    );
    this.add.existing(dragonOrange);


    this.heroes = [warrior, mage];

    this.enemies = [dragonblue, dragonOrange];

    this.units = this.heroes.concat(this.enemies);

    this.index = -1;

    this.scene.run('UIScene');
  },
  nextTurn() {
    if (this.checkEndBattle() === 'Vitory') {
      score += scoreUpdate(score);
      this.endBattle();
      return;
    }
    if (this.checkEndBattle() === 'GameOver') {
      this.endBattle(true);
      return;
    }
    do {
      this.index++;

      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);

    if (this.units[this.index] instanceof PlayerCharacter) {
      this.events.emit('PlayerSelect', this.index);
    } else {
      let r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);

      this.units[this.index].attack(this.heroes[r]);

      this.time.addEvent({
        delay: 3000,
        callback: this.nextTurn,
        callbackScope: this,
      });
    }
  },

  // eslint-disable-next-line consistent-return
  checkEndBattle() {
    let victory = true;

    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) victory = false;
    }
    let gameOver = true;

    for (let i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].living) gameOver = false;
    }

    if (victory) {
      return 'Vitory';
    }
    if (gameOver) {
      return 'GameOver';
    }
  },

  receivePlayerSelection(action, target) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }

    this.time.addEvent({
      delay: 3000,
      callback: this.nextTurn,
      callbackScope: this,
    });
  },
  endBattle(param = false) {
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      this.units[i].destroy();
    }
    this.units.length = 0;

    if (param) {
      this.scene.sleep('UIScene');
      this.scene.switch('GameOver');
    } else {
      this.scene.sleep('UIScene');

      this.scene.switch('WorldScene');
    }
  },
});
// eslint-disable-next-line import/no-mutable-exports
let score = 0;

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Unit(scene, x, y, texture, frame, type, hp, damage) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage;
    this.living = true;
    this.menuItem = null;
  },

  setMenuItem(item) {
    this.menuItem = item;
  },

  attack(target) {
    if (target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit(
        'Message',
        `${this.type} attacks ${target.type} for ${this.damage} damage`,
      );
    }
  },
  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  },
});

let Enemy = new Phaser.Class({
  Extends: Unit,

  initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
    texture = enemySelect(score);
    type = texture;
    hp = powerAssign(type)[0];
    damage = powerAssign(type)[1];
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
  },
});

let PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize: function PlayerCharacter(
    scene,
    x,
    y,
    texture,
    frame,
    type,
    hp,
    damage,
  ) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);

    this.flipX = true;

    this.setScale(2);
  },
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize: function MenuItem(x, y, text, scene) {
    Phaser.GameObjects.Text.call(this, scene, x, y, text, {
      color: '#ffffff',
      align: 'left',
      fontSize: 20,
    });
  },

  select() {
    this.setColor('#f8ff38');
  },

  deselect() {
    this.setColor('#ffffff');
  },

  unitKilled() {
    this.active = false;
    this.visible = false;
  },
});


const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  // eslint-disable-next-line no-unused-vars
  initialize: function Menu(x, y, scene, heroes) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.x = x;
    this.y = y;
    this.selected = false;
  },
  addMenuItem(unit) {
    const menuItem = new MenuItem(
      0,
      this.menuItems.length * 20,
      unit,
      this.scene,
    );
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  },

  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0) this.menuItemIndex = this.menuItems.length - 1;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },

  select(index) {
    if (!index) index = 0;
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
      if (this.menuItemIndex === index) return;
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  },

  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  },
  confirm() {},

  clear() {
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },

  remap(units) {
    this.clear();
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      unit.setMenuItem(this.addMenuItem(unit.type));
    }
    this.menuItemIndex = 0;
  },
});

const HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize: function HeroesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize: function ActionsMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
    this.addMenuItem('Attack');
  },
  confirm() {
    this.scene.events.emit('SelectedAction');
  },
});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize: function EnemiesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
  confirm() {
    this.scene.events.emit('Enemy', this.menuItemIndex);
  },
});


const UIScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function UIScene() {
    Phaser.Scene.call(this, { key: 'UIScene' });
  },

  create() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(200, 400, 100, 100);
    this.graphics.fillRect(200, 400, 100, 100);
    this.graphics.strokeRect(350, 400, 90, 50);
    this.graphics.fillRect(350, 400, 90, 50);
    this.graphics.strokeRect(500, 400, 100, 100);
    this.graphics.fillRect(500, 400, 100, 100);


    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(502, 400, this);
    this.actionsMenu = new ActionsMenu(352, 400, this);
    this.enemiesMenu = new EnemiesMenu(202, 400, this);


    this.currentMenu = this.actionsMenu;


    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battleScene = this.scene.get('BattleScene');


    this.input.keyboard.on('keydown', this.onKeyInput, this);


    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);


    this.events.on('SelectedAction', this.onSelectedAction, this);


    this.events.on('Enemy', this.onEnemy, this);


    this.sys.events.on('wake', this.createMenu, this);


    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.createMenu();
  },
  createMenu() {
    this.remapHeroes();

    this.remapEnemies();

    this.battleScene.nextTurn();
  },
  onEnemy(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  },
  onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  },


  onSelectedAction() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  },
  remapHeroes() {
    const { heroes } = this.battleScene;
    this.heroesMenu.remap(heroes);
  },
  remapEnemies() {
    const { enemies } = this.battleScene;
    this.enemiesMenu.remap(enemies);
  },
  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      // eslint-disable-next-line no-empty
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {
      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  },
});


let Message = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function Message(scene, events) {
    Phaser.GameObjects.Container.call(this, scene, 160, 30);
    const graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    this.text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
      color: '#ffffff',
      align: 'center',
      fontSize: 15,
      wordWrap: { width: 200, useAdvancedWrap: true },
    });
    this.add(this.text);
    this.text.setOrigin(-1);
    events.on('Message', this.showMessage, this);
    this.visible = false;
  },
  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: this.hideMessage,
      callbackScope: this,
    });
  },
  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  },
});

export { BattleScene, UIScene, score };
