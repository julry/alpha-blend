import {useEffect, useReducer} from "react";
import isNil from "lodash/isNil";
import isEqual from "lodash/isEqual";
import flattenDeep from "lodash/flattenDeep";
import { uid } from "uid";
import { ACTIONS, TILE_COUNT_PER_DIMENSION, MOVE_ANIMATION_DURATION } from "./constants";
import { FINISH_SCORE } from "./constants";
import { DELETE_ANIMATION_DURATION } from "./constants";

function createBoard() {
    const board = [];

    for (let i = 0; i < TILE_COUNT_PER_DIMENSION; i += 1) {
        board[i] = new Array(TILE_COUNT_PER_DIMENSION).fill(undefined);
    }

    return board;
}

export const initialState = {
    board: createBoard(),
    tiles: {},
    tilesByIds: [],
    hasChanged: false,
    score: 0,
    lastMerged: 0,
};

function gameReducer(
    state = initialState,
    action,
) {
    switch (action.type) {
        case ACTIONS.RESTART: {
            return initialState;
        }
        case ACTIONS.DELETE_TILE: {
            const flattenBoard = flattenDeep(state.board);
            const newTiles = flattenBoard.reduce(
                (result, tileId) => {
                    if (isNil(tileId) || tileId === action.tile?.id) {
                        return result;
                    }

                    return {
                        ...result,
                        [tileId]: state.tiles[tileId],
                    };
                },
                {},
            );

            return {
                ...state,
                tiles: newTiles,
                tilesByIds: Object.keys(newTiles),
                hasChanged: false,
            };
        }
        case ACTIONS.CLEAN_UP: {
            const flattenBoard = flattenDeep(state.board);
            const newTiles = flattenBoard.reduce(
                (result, tileId) => {
                    if (isNil(tileId)) {
                        return result;
                    }

                    return {
                        ...result,
                        [tileId]: state.tiles[tileId],
                    };
                },
                {},
            );

            return {
                ...state,
                tiles: newTiles,
                tilesByIds: Object.keys(newTiles),
                hasChanged: false,
            };
        }
        case ACTIONS.CREATE_TILE: {
            const tileId = uid();
            const [x, y] = action.tile.position;
            const newBoard = JSON.parse(JSON.stringify(state.board));
            newBoard[y][x] = tileId;

            return {
                ...state,
                board: newBoard,
                tiles: {
                    ...state.tiles,
                    [tileId]: {
                        id: tileId,
                        ...action.tile,
                    },
                },
                tilesByIds: [...state.tilesByIds, tileId],
            };
        }
        case ACTIONS.MOVE_UP: {
            const newBoard = createBoard();
            const newTiles = {};
            let hasChanged = false;
            let lastMerged;
            let { score } = state;

            for (let x = 0; x < TILE_COUNT_PER_DIMENSION; x++) {
                let newY = 0;
                let previousTile;

                for (let y = 0; y < TILE_COUNT_PER_DIMENSION; y++) {
                    const tileId = state.board[y][x];
                    const currentTile = state.tiles[tileId];

                    if (!isNil(tileId) && !isNil(currentTile)) {
                        if (previousTile?.value === currentTile.value) {
                            score += previousTile.value * 2;
                            newTiles[previousTile.id] = {
                                ...previousTile,
                                value: previousTile.value * 2,
                            };
                            newTiles[tileId] = {
                                ...currentTile,
                                position: [x, newY - 1],
                            };
                            lastMerged = currentTile.value * 2;
                            previousTile = undefined;
                            hasChanged = true;
                            
                            continue;
                        }

                        newBoard[newY][x] = tileId;
                        newTiles[tileId] = {
                            ...currentTile,
                            position: [x, newY],
                        };
                        previousTile = newTiles[tileId];
                        if (!isEqual(currentTile.position, [x, newY])) {
                            hasChanged = true;
                        }
                        newY++;
                    }
                }
            }

            return {
                ...state,
                board: newBoard,
                tiles: newTiles,
                lastMerged: lastMerged ? lastMerged : state.lastMerged,
                hasChanged,
                score,
            };
        }
        case ACTIONS.MOVE_DOWN: {
            const newBoard = createBoard();
            const newTiles = {};
            let hasChanged = false;
            let lastMerged;
            let { score } = state;

            for (let x = 0; x < TILE_COUNT_PER_DIMENSION; x++) {
                let newY = TILE_COUNT_PER_DIMENSION - 1;
                let previousTile;

                for (let y = TILE_COUNT_PER_DIMENSION - 1; y >= 0; y--) {
                    const tileId = state.board[y][x];
                    const currentTile = state.tiles[tileId];

                    if (!isNil(tileId) && !isNil(currentTile)) {
                        if (previousTile?.value === currentTile.value) {
                            score += previousTile.value * 2;
                            newTiles[previousTile.id] = {
                                ...previousTile,
                                value: previousTile.value * 2,
                            };
                            newTiles[tileId] = {
                                ...currentTile,
                                position: [x, newY + 1],
                            };
                            lastMerged = previousTile.value * 2;
                            previousTile = undefined;
                            hasChanged = true;
                            continue;
                        }

                        newBoard[newY][x] = tileId;
                        newTiles[tileId] = {
                            ...currentTile,
                            position: [x, newY],
                        };
                        previousTile = newTiles[tileId];
                        if (!isEqual(currentTile.position, [x, newY])) {
                            hasChanged = true;
                        }
                        newY--;
                    }
                }
            }
            return {
                ...state,
                board: newBoard,
                tiles: newTiles,
                lastMerged: lastMerged ? lastMerged : state.lastMerged,
                hasChanged,
                score,
            };
        }
        case ACTIONS.MOVE_LEFT: {
            const newBoard = createBoard();
            const newTiles = {};
            let hasChanged = false;
            let lastMerged;
            let { score } = state;

            for (let y = 0; y < TILE_COUNT_PER_DIMENSION; y++) {
                let newX = 0;
                let previousTile;

                for (let x = 0; x < TILE_COUNT_PER_DIMENSION; x++) {
                    const tileId = state.board[y][x];
                    const currentTile = state.tiles[tileId];

                    if (!isNil(tileId) && !isNil(currentTile)) {
                        if (previousTile?.value === currentTile.value) {
                            score += previousTile.value * 2;
                            newTiles[previousTile.id] = {
                                ...previousTile,
                                value: previousTile.value * 2,
                            };
                            lastMerged = previousTile.value * 2;
                            newTiles[tileId] = {
                                ...currentTile,
                                position: [newX - 1, y],
                            };
                            previousTile = undefined;
                            hasChanged = true;
                            continue;
                        }

                        newBoard[y][newX] = tileId;
                        newTiles[tileId] = {
                            ...currentTile,
                            position: [newX, y],
                        };
                        previousTile = newTiles[tileId];
                        if (!isEqual(currentTile.position, [newX, y])) {
                            hasChanged = true;
                        }
                        newX++;
                    }
                }
            }
            return {
                ...state,
                board: newBoard,
                tiles: newTiles,
                lastMerged: lastMerged ? lastMerged : state.lastMerged,
                hasChanged,
                score,
            };
        }
        case ACTIONS.MOVE_RIGHT: {
            const newBoard = createBoard();
            const newTiles = {};
            let hasChanged = false;
            let lastMerged;
            let { score } = state;

            for (let y = 0; y < TILE_COUNT_PER_DIMENSION; y++) {
                let newX = TILE_COUNT_PER_DIMENSION - 1;
                let previousTile;

                for (let x = TILE_COUNT_PER_DIMENSION - 1; x >= 0; x--) {
                    const tileId = state.board[y][x];
                    const currentTile = state.tiles[tileId];

                    if (!isNil(tileId) && !isNil(currentTile)) {
                        if (previousTile?.value === currentTile.value) {
                            score += previousTile.value * 2;
                            newTiles[previousTile.id] = {
                                ...previousTile,
                                value: previousTile.value * 2,
                            };
                            newTiles[tileId] = {
                                ...currentTile,
                                position: [newX + 1, y],
                            };
                            lastMerged = previousTile.value * 2;
                            previousTile = undefined;
                            hasChanged = true;
                            continue;
                        }

                        newBoard[y][newX] = tileId;
                       
                        newTiles[tileId] = {
                            ...state.tiles[tileId],
                            position: [newX, y],
                        };
                        previousTile = newTiles[tileId];
                        if (!isEqual(currentTile.position, [newX, y])) {
                            hasChanged = true;
                        }
                        newX--;
                    }
                }
            }
            return {
                ...state,
                board: newBoard,
                tiles: newTiles,
                hasChanged,
                lastMerged: lastMerged ? lastMerged : state.lastMerged,
                score,
            };
        }
        default:
            return state;
    }
}

export function useGame(onWin, onLose) {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);

    const getEmptyCells = () => {
        const results = [];

        for (let x = 0; x < TILE_COUNT_PER_DIMENSION; x++) {
            for (let y = 0; y < TILE_COUNT_PER_DIMENSION; y++) {
                if (isNil(gameState.board[y][x])) {
                    results.push([x, y]);
                }
            }
        }
        return results;
    };

    const appendRandomTile = () => {
        const emptyCells = getEmptyCells();
        if (emptyCells.length > 0) {
            const cellIndex = Math.floor(Math.random() * emptyCells.length);
            const newTile = {
                position: emptyCells[cellIndex],
                value: 2,
            };
            dispatch({ type: ACTIONS.CREATE_TILE, tile: newTile });
        }
    };

    const getTiles = () => {
        return gameState.tilesByIds.map((tileId) => gameState.tiles[tileId]);
    };

    const hasTileValue = (value) => {
        return getTiles().some(tile => tile?.value === value)
    };

    const restartGame = () => {
        dispatch({type: ACTIONS.RESTART});
        startGame();
    }

    const hasMoves = () => {
        if (getEmptyCells().length) {
            return true
        }

        for (let x = 0; x < TILE_COUNT_PER_DIMENSION; x++) {
            for (let y = 0; y < TILE_COUNT_PER_DIMENSION; y++) {
                const tile = gameState.tiles[gameState.board[y]?.[x]]
                const topTile = gameState.tiles[gameState.board[y-1]?.[x]]
                const bottomTile = gameState.tiles[gameState.board[y+1]?.[x]]
                const leftTile = gameState.tiles[gameState.board[y]?.[x-1]]
                const rightTile = gameState.tiles[gameState.board[y]?.[x+1]]

                if (
                    tile && (
                        tile.value === topTile?.value
                        || tile.value === bottomTile?.value
                        || tile.value === leftTile?.value
                        || tile.value === rightTile?.value
                    )
                ) {
                    return true
                }
            }
        }

        return false
    };

    const moveTiles = (type) => {
        if (gameState.hasChanged) {
            return
        }

        dispatch({type})
    }

    const startGame = () => {
        dispatch({ type: ACTIONS.CREATE_TILE, tile: { position: [2, 3], value: 4 } });
        dispatch({ type: ACTIONS.CREATE_TILE, tile: { position: [3, 3], value: 4 } });
    };

    const result = {
        score: gameState.score,
        getTiles,
        hasTileValue,
        moveTiles,
        startGame,
        restartGame,
    };

    useEffect(() => {
        if (gameState.hasChanged) {
            setTimeout(() => {
                dispatch({ type: ACTIONS.CLEAN_UP });
                appendRandomTile();
            }, MOVE_ANIMATION_DURATION);
        }
    }, [gameState.hasChanged]);

    useEffect(() => {
        if (hasTileValue(2024)) {
            onWin?.(result)
        } else if (!hasMoves()) {
            onLose?.({isFromGame: true})
        }
    }, [gameState, onWin, onLose]);

    useEffect(() => {
        const finishTile =  getTiles().find(tile => tile?.value === FINISH_SCORE);
        if (!finishTile) return;
        setTimeout(() => dispatch({type: ACTIONS.DELETE_TILE, tile: finishTile}), DELETE_ANIMATION_DURATION);
    }, [gameState.hasChanged])

    return result
}