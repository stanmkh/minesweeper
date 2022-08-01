import {createHiddenBoard, createRandomRevealedBoard} from './BoardStateHelpers'
import BoardProps from './BoardProps'
import CellState from './CellState'

class Board {

    revealedBoardState: CellState[][]
    boardState: CellState[][]

    constructor(boardProps: BoardProps) {
        this.revealedBoardState = createRandomRevealedBoard(boardProps)
        this.boardState = createHiddenBoard(boardProps)
    }

    mapRows<T>(callback: (row: CellState[], rowIndex: number) => T): T[] {
        return this.boardState.map(callback)
    }

    revealCell(row: number, column: number): void {
        this.boardState[row][column] = this.revealedBoardState[row][column]
    }
}

export default Board

