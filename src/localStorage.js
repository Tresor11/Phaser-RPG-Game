function currentPlayer(params) {
  const currentP = JSON.stringify(params);
  window.localStorage.setItem('currentP', currentP);
  return (currentP);
}

function getCurrentPlayer() {
  const currentP = localStorage.getItem('currentP');
  return JSON.parse(currentP);
}

function currentScore(params = 0) {
  const currentP = JSON.stringify(params);
  window.localStorage.setItem('currentS', currentP);
  return (currentP);
}

function getCurrentScore() {
  const currentP = localStorage.getItem('currentS');
  return JSON.parse(currentP);
}

export {
  currentPlayer, getCurrentPlayer, currentScore, getCurrentScore,
};
