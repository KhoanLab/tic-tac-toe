import { GAME_STATUS, TURN } from './constants.js';
import {
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from './selectors.js';
import {
  checkGameStatus,
  hideReplayButton,
  highlightWinCells,
  showReplayButton,
} from './utils.js';

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill('');
let gameStatus = GAME_STATUS.PLAYING;

// console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));
// console.log(checkGameStatus(['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O']));

function toggleTurn() {
  // toogle turn
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  // update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const gameStatusElement = getGameStatusElement();
  if (!gameStatusElement) return;

  gameStatusElement.textContent = newGameStatus;
}

function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;

  // Only allow to click if game is playing and that cell is not clicked yet
  if (isClicked || isEndGame) return;
  // set selected cell
  cell.classList.add(currentTurn);

  // update cellValues
  cellValues[index] = currentTurn;

  // check game status
  const game = checkGameStatus(cellValues);

  switch (game.status) {
    case GAME_STATUS.ENDED: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      // update game status
      updateGameStatus(game.status);

      // show replay button
      showReplayButton();

      // highlight win cells
      highlightWinCells(game.winPositions);

      break;
    }

    default:
    // playing
  }

  // toggle turn
  toggleTurn();
}

function initCellElementList() {
  const cellElementList = getCellElementList();

  cellElementList.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
  });
}

function resetGame() {
  // reset temp global variables
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => '');

  // reset dom elements
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);

  // reset current turn
  // update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }

  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = '';
  }

  // hide replay button
  hideReplayButton();

  console.log('clicked replay button');
}

function initReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) {
    replayButtonElement.addEventListener('click', resetGame);
  }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  // bind click event for all li elements
  initCellElementList();

  // bind click event for replay button
  initReplayButton();
})();
