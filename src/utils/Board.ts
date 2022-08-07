import {createBoard} from './BoardStateHelpers'
import BoardProps from './BoardProps'
import CellState from './CellState'

class Board {

    cells: CellState[][]

    constructor(boardProps: BoardProps) {
        this.cells = createBoard(boardProps)
    }

    mapRows<T>(callback: (row: CellState[], rowIndex: number) => T): T[] {
        return this.cells.map(callback)
    }

    revealCell(row: number, column: number): void {
        if (row < 0 || row >= this.cells.length || column < 0 || column >= this.cells[0].length) {
            return
        }

        const cell = this.cells[row][column]

        if (!cell.isHidden) {
            return
        }

        cell.isHidden = false
        if (!cell.containsMine && cell.proximityCount === 0) {
            this.revealCell(row - 1, column - 1)
            this.revealCell(row - 1, column)
            this.revealCell(row - 1, column + 1)
            this.revealCell(row, column - 1)
            this.revealCell(row, column + 1)
            this.revealCell(row + 1, column - 1)
            this.revealCell(row + 1, column)
            this.revealCell(row + 1, column + 1)
        }
    }
}

export default Board

