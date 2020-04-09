import { submitScore, getScoreBoard, createGame } from '../API';

describe('submit a score if input are valid', () => {
  test('submit score to the Api if the imput are valid', () => submitScore('tresor', 30).then((data) => {
    expect(data).toBe('Leaderboard score created correctly.');
  }));
});
