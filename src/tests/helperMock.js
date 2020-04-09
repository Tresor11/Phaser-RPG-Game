/* eslint-disable import/no-cycle */
/* eslint-disable no-undef */

function enemySelect(currentScore) {
  let index;
  const enemyarr = ['wizarus1', 'wizarus2', 'wizarus3', 'ghostus', 'master'];
  if (currentScore <= 50 && currentScore >= 0) {
    index = 0;
  } else if (currentScore <= 200 && currentScore >= 50) {
    index = 2;
  } else {
    index = 4;
  }
  return enemyarr[index];
}

const scoreUpdate = (Score) => {
  if (Score <= 50 && Score >= 0) {
    return 35;
  } if (Score <= 200 && Score >= 50) {
    return 50;
  }
  return 100;
};

function powerAssign(el) {
  switch (el) {
    case 'wizarus1':
      return [80, 80];
    case 'wizarus2':
      return [90, 90];
    case 'wizarus3':
      return [100, 110];
    case 'ghostus':
      return [150, 120];
    case 'master':
      return [200, 150];
    default:
      return 50;
  }
}

export {
  enemySelect, scoreUpdate, powerAssign,
};
