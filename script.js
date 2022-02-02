import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from './app.js';

const BOARD_SIZE = 10;
const MINE_COUNT = 10

const board = createBoard(BOARD_SIZE, MINE_COUNT);
const boardElement = document.querySelector('.board');
const countElement = document.querySelector('[data-mine-count]');
const textElement = document.querySelector('.sub-text');

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.addEventListener('click', () =>{
            revealTile(board, tile);
            checkGameEnd();
        });
        tile.addEventListener('contextmenu', e =>{
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        });
    });
});

boardElement.style.setProperty('--size', BOARD_SIZE);
countElement.textContent = MINE_COUNT;

let listMinesLeft = () => {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    }, 0);

    countElement.textContent = MINE_COUNT - markedTilesCount;
}

let checkGameEnd = () => {
    const condition = {
        win: checkWin(board),
        lose: checkLose(board)
    };

    if(condition.win||condition.lose){
        boardElement.addEventListener('click', stopProp, {capture: true});
        boardElement.addEventListener('contextmenu', stopProp, {capture: true});
    }

    if(condition.win) textElement.textContent = "You Win!";
    if(condition.lose){
        textElement.textContent = "You Lose.";
        board.forEach(row => {
            board.forEach(tile => {
                if(tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if(tile.mine) revealTile(board, tile);
            })  
        })
    }
}

let stopProp = (e) => {
    e.stopImmediatePropagation();
}