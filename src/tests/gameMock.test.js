/* eslint-disable no-undef */
import engine from './gameMock';


describe('test the game creation', () => {
  test('create a new game oblect', () => {
    expect(typeof engine()).toBe('object');
  });

  test('create all the provided scenes', () => {
    expect(typeof engine().scene.scenes.length).toBe('number');
  });
});
