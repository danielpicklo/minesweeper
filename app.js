export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MARKED: 'marked',
    NUMBER: 'number',
    MINE: 'mine'
};

export let createBoard = (size, mineCount) => {
    const board = [];
    const minePos = getMinePos(size, mineCount);
    for(let x = 0; x < size; x++){
        const row = [];
        for(let y = 0; y < size; y++){
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            const tile = {
                element,
                x,
                y,
                mine: minePos.some(p => positionMatch(p, {x, y})),
                get status(){return this.element.dataset.status},
                set status(value){this.element.dataset.status = value;}
            };
            row.push(tile);
        }
        board.push(row);
    }
    return board;
}

export let markTile = (tile) =>{
    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED){
        return;
    }else if(tile.status === TILE_STATUSES.MARKED){
        tile.status = TILE_STATUSES.HIDDEN;
    }else{
        tile.status = TILE_STATUSES.MARKED;
    }
}

export let revealTile = (board, tile) => {
    if(tile.status !== TILE_STATUSES.HIDDEN){
        return;
    }else if(tile.mine){
        tile.status = TILE_STATUSES.MINE;
        return;
    }

    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const mines = adjacentTiles.filter(t => t.mine);
    if(mines.length === 0){
        adjacentTiles.forEach(revealTile.bind(null, board));
    }else{
        tile.element.textContent = mines.length;
    }
}

export let checkWin = (board) => {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.MARKED || tile.status === TILE_STATUSES.HIDDEN));
        });
    });
}

export let checkLose = (board) => {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE;
        });
    });
}

let getMinePos = (size, mineCount) => {
    const positions = [];

    while(positions.length < mineCount){
        const position = {
            x: randomNumber(size),
            y: randomNumber(size)
        }

        if(!positions.some(p => positionMatch(p, position))){
            positions.push(position);
        }
    }

    return positions;
}

let randomNumber = (size) => {
    return Math.floor(Math.random() * size);
}

let positionMatch = (a, b) => {
    return a.x === b.x && a.y === b.y;
}

let nearbyTiles = (board, {x, y}) => {
    const adjacentTiles = [];

    for(let xOffset = -1; xOffset <= 1; xOffset++){
        for(let yOffset = -1; yOffset <= 1; yOffset++){
            const tile = board[x + xOffset]?.[y + yOffset];
            if(tile) adjacentTiles.push(tile);
        }
    }

    return adjacentTiles;
}