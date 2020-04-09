/* eslint-disable no-undef */
import {
  enemySelect, scoreUpdate, powerAssign,
} from './helperMock';

describe('select the enemy according to the current score', () => {
  test('return wizarus if score < 50', () => {
    expect(enemySelect(10)).toBe('wizarus1');
  });

  test('return wizarus or ghostus if score > 50', () => {
    expect(enemySelect(70)).toBe('wizarus3');
  });
});

describe('assign the hp and the damage differently', () => {
  test('wizarus1 should have 80 damage', () => {
    expect(powerAssign('wizarus1')[1]).toBe(80);
  });

  test('master yould have hp 200', () => {
    expect(powerAssign('master')[0]).toBe(200);
  });
});

describe('update the score according to the current level', () => {
  test('add 35 point if level1', () => {
    expect(scoreUpdate(20)).toBe(35);
  });

  test('add 100 piont if level 3', () => {
    expect(scoreUpdate(210)).toBe(100);
  });
});
