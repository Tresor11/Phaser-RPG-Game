const fetch = require('node-fetch');

const createGame = async () => {
  const name = {
    name: 'Forest-Defender',
  };
  const game = JSON.stringify(name);
  const address = 'https://us-central1-js-capstone-backend.cloudconsts.net/api/games/';
  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: game,
  };
  const response = await fetch(address, settings);
  const answer = await response.json();
  return answer;
};

const submitScore = async (name, score) => {
  const submit = {
    user: name,
    score,
  };
  const post = JSON.stringify(submit);
  const address = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/XHg3mRHc25dQtUcRlLYE/scores/';
  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: post,
  };
  const response = await fetch(address, settings);
  const answer = await response.json();
  return answer;
};

const sorting = (obj) => {
  const array = [];
  for (let i = 0; i < obj.length; i += 1) {
    array.push([obj[i].score, obj[i].user]);
  }
  return Array.from(array).sort((a, b) => b[0] - a[0]);
};

const getScoreBoard = async () => {
  const address = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/XHg3mRHc25dQtUcRlLYE/scores/';
  const settings = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(address, settings);
  const answer = await response.json();
  return sorting(answer.result);
};

export {
  submitScore, createGame, getScoreBoard,
};
