/* eslint-disable func-names */
import 'phaser';
import {
  currentPlayer,
  getCurrentPlayer,
  currentScore,
  getCurrentScore,
} from './localStorage';
import { score } from './Scenes/Battle';
import { submitScore, getScoreBoard } from './API';

const dom = (() => {
  const getElement = (id) => document.getElementById(id);

  const getName = (id) => {
    const name = getElement(id).value;
    return name;
  };

  return {
    getElement,
    getName,
  };
})();

const boardList = async () => {
  let list = `<h1 class="text-c">Leader Board</h1>
  <h4><span>Place</span><span>Score</span><span>Name</span></h4>`;
  const leaderBoard = await getScoreBoard();
  leaderBoard.forEach((element) => {
    list += `<h4><span>${leaderBoard.indexOf(element) + 1}</span><span>${
      element[0]
    }</span><span>${element[1]}</span></h4>`;
  });
  return list;
};

const render = async () => {
  const data = await boardList();
  dom.getElement('learder').innerHTML = data;
};

render();

const submit = document.getElementById('play');
const from = document.getElementById('user-name');

if (getCurrentPlayer()) {
  from.style.display = 'none';
}
const hide = () => {
  const player = dom.getName('name');
  currentPlayer(player);
  from.style.display = 'none';
};
submit.addEventListener('click', hide);

const liveUpdate = () => {
  if (score > getCurrentScore()) {
    currentScore(score);
    submitScore(getCurrentPlayer(), getCurrentScore()).then(render());
  }
};

export default liveUpdate;
