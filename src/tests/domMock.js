/* eslint-disable func-names */

function boardList(bool) {
  if (bool) {
    return 'html';
  }
  return false;
}

function render(callback) {
  if (callback) {
    return 200;
  }
  return false;
}

const liveUpdate = (previous, current) => {
  if (current > previous) {
    return current;
  }

  return previous;
};

export { liveUpdate, render, boardList };
