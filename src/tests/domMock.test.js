/* eslint-disable no-undef */
import { liveUpdate, render, boardList } from './domMock';

describe('update if the score', () => {
  test('update only if the user beats his record', () => {
    expect(liveUpdate(10, 50)).toBe(50);
  });

  test('keep the previous score id the current is low', () => {
    expect(liveUpdate(100, 80)).toBe(100);
  });
});

describe('update the html', () => {
  test('update the html if the promise was resolved', () => {
    expect(boardList(true)).toBe('html');
  });

  test('no update is there was no positive response', () => {
    expect(boardList(false)).toBe(false);
  });
});

describe('render depending on the callback status', () => {
  test('render if the callback was resolved', () => {
    expect(render(boardList(true))).toBe(200);
  });

  test('no render if the callback was not resolved', () => {
    expect(render(boardList(false))).toBe(false);
  });
});
