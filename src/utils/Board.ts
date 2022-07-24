import {createGameBoardState} from "./BoardStateHelpers"
import BoardProps from "./BoardProps"
import CellState from "./CellState"

class Board {

    boardState: CellState[][]

    constructor(boardProps: BoardProps) {
        this.boardState = createGameBoardState(boardProps)
    }

    mapRows<T>(callback: (row: CellState[], rowIndex: number) => T): T[] {
        return this.boardState.map(callback)
    }
}

export default Board

