/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
const BattleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function BattleScene() {
    Phaser.Scene.call(this, { key: 'BattleScene' });
  },
  create() {
    // change the background to green
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();
    // on wake event we call startBattle too
    this.sys.events.on('wake', this.startBattle, this);
  },
  startBattle() {
    // player character - warrior
    const warrior = new PlayerCharacter(
      this,
      500,
      150,
      'player',
      1,
      'Warrior',
      100,
      200,
    );
    this.add.existing(warrior);

    // player character - mage
    const mage = new PlayerCharacter(
      this,
      500,
      200,
      'player',
      4,
      'Mage',
      80,
      800,
    );
    this.add.existing(mage);

    const dragonblue = new Enemy(
      this,
      250,
      150,
      'dragonblue',
      null,
      'Dragon',
      50,
      100,
    );
    this.add.existing(dragonblue);

    const dragonOrange = new Enemy(
      this,
      250,
      200,
      'dragonorrange',
      null,
      'Dragon2',
      50,
      100,
    );
    this.add.existing(dragonOrange);

    // array with heroes
    this.heroes = [warrior, mage];
    // array with enemies
    this.enemies = [dragonblue, dragonOrange];
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies);

    this.index = -1; // currently active unit

    this.scene.run('UIScene');
  },
  nextTurn() {
    // if we have victory or game over
    if (this.checkEndBattle() === 'Vitory') {
      score += 20;
      this.endBattle();
      return;
    } if (this.checkEndBattle() === 'GameOver') {
      this.endBattle(true);
      return;
    }
    do {
      // currently active unit
      this.index++;
      // if there are no more units, we start again from the first one
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);
    // if its player hero
    if (this.units[this.index] instanceof PlayerCharacter) {
      // we need the player to select action and then enemy
      this.events.emit('PlayerSelect', this.index);
    } else {
      // else if its enemy unit
      // pick random living hero to be attacked
      let r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);
      // call the enemy's attack function
      this.units[this.index].attack(this.heroes[r]);
      // add timer for the next turn, so will have smooth gameplay
      this.time.addEvent({
        delay: 3000,
        callback: this.nextTurn,
        callbackScope: this,
      });
    }
  },
  // check for game over or victory
  checkEndBattle() {
    let victory = true;
    // if all enemies are dead we have victory
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) victory = false;
    }
    let gameOver = true;
    // if all heroes are dead we have game over
    for (let i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].living) gameOver = false;
    }

    if (victory) {
      return 'Vitory';
    } if (gameOver) {
      return 'GameOver';
    }
  },
  // when the player have selected the enemy to be attacked
  receivePlayerSelection(action, target) {
    if (action == 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    // next turn in 3 seconds
    this.time.addEvent({
      delay: 3000,
      callback: this.nextTurn,
      callbackScope: this,
    });
  },
  endBattle(param = false) {
    // clear state, remove sprites
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      // link item
      this.units[i].destroy();
    }
    this.units.length = 0;
    // sleep the UI
    if (param) {
      this.scene.sleep('UIScene');
      // return to WorldScene and sleep current BattleScene
      this.scene.switch('Credits');
    } else {
      this.scene.sleep('UIScene');
      // return to WorldScene and sleep current BattleScene
      this.scene.switch('WorldScene');
    }
  },
});

let score = 0;
const scoreUpdate = (el) => {
  setInterval(() => {
    el.setText(`Score: ${score}`);
  }, 500);
};

// base class for heroes and enemies
const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Unit(scene, x, y, texture, frame, type, hp, damage) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage; // default damage
    this.living = true;
    this.menuItem = null;
  },
  // we will use this to notify the menu item when the unit is dead
  setMenuItem(item) {
    this.menuItem = item;
  },
  // attack the target unit
  attack(target) {
    if (target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit(
        'Message',
        `${this.type
        } attacks ${
          target.type
        } for ${
          this.damage
        } damage`,
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
    // flip the image so I don"t have to edit it manually
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
  // when the associated enemy or player unit is killed
  unitKilled() {
    this.active = false;
    this.visible = false;
  },
});

// base menu class, container for menu items
const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

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
  // menu navigation
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
  // select the menu as a whole and highlight the choosen element
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
  // deselect this menu
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  },
  confirm() {},
  // clear menu and remove all menu items
  clear() {
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  // recreate the menu items
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
    // we select an action and go to the next menu and choose from the enemies to apply the action
    this.scene.events.emit('SelectedAction');
  },
});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize: function EnemiesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
  confirm() {
    // the player has selected the enemy and we send its id with the event
    this.scene.events.emit('Enemy', this.menuItemIndex);
  },
});

// User Interface scene
const UIScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function UIScene() {
    Phaser.Scene.call(this, { key: 'UIScene' });
  },

  create() {
    // draw some background for the menu
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(200, 300, 100, 100);
    this.graphics.fillRect(200, 300, 100, 100);
    this.graphics.strokeRect(350, 300, 90, 50);
    this.graphics.fillRect(350, 300, 90, 50);
    this.graphics.strokeRect(500, 300, 100, 100);
    this.graphics.fillRect(500, 300, 100, 100);

    // basic container to hold all menus
    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(502, 300, this);
    this.actionsMenu = new ActionsMenu(352, 300, this);
    this.enemiesMenu = new EnemiesMenu(202, 300, this);

    // the currently selected menu
    this.currentMenu = this.actionsMenu;

    // add menus to the container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battleScene = this.scene.get('BattleScene');

    // listen for keyboard events
    this.input.keyboard.on('keydown', this.onKeyInput, this);

    // when its player cunit turn to move
    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

    // when the action on the menu is selected
    // for now we have only one action so we dont send and action id
    this.events.on('SelectedAction', this.onSelectedAction, this);

    // an enemy is selected
    this.events.on('Enemy', this.onEnemy, this);

    // when the scene receives wake event
    this.sys.events.on('wake', this.createMenu, this);

    // the message describing the current action
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.createMenu();
  },
  createMenu() {
    // map hero menu items to heroes
    this.remapHeroes();
    // map enemies menu items to enemies
    this.remapEnemies();
    // first move
    this.battleScene.nextTurn();
  },
  onEnemy(index) {
    // when the enemy is selected, we deselect all menus and send event with the enemy id
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  },
  onPlayerSelect(id) {
    // when its player turn, we select the active hero item and the first action
    // then we make actions menu active
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  },
  // we have action selected and we make the enemies menu active
  // the player needs to choose an enemy to attack
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
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {
      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  },
});

// the message class extends containter
let Message = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function Message(scene, events) {
    Phaser.GameObjects.Container.call(this, scene, 160, 30);
    const graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(158, 29, 190, 50);
    graphics.fillRect(158, 29, 190, 50);
    this.text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
      color: '#ffffff',
      align: 'center',
      fontSize: 15,
      wordWrap: { width: 180, useAdvancedWrap: true },
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

export {
  BattleScene, UIScene, score, scoreUpdate,
};
