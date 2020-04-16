/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import {
  currentPlayer, getCurrentPlayer, currentScore, getCurrentScore,
} from './storageMock';

describe('create a new user in the local storage', () => {
  test('return a json object of created user', () => {
    expect(typeof currentPlayer('louis')).toBe('string');
  });
});

describe('retrieve the user from the storage', () => {
  ('return the stored user', () => {
    expect(getCurrentPlayer()).toBe('louis');
  });
});

describe('save the score', () => {
  test('return a json object score', () => {
    expect(typeof currentScore(20)).toBe('string');
  });
});

describe('retrieve the score from the storage', () => {
  ('return the stored score', () => {
    expect(getCurrentPlayer()).toBe(20);
  });
});
