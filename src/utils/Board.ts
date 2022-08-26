import BoardProps from './BoardProps'
import Cell, {cellStateFactoryMethod, CellType} from './Cell'

class Board {

    cells: Cell[][]

    constructor(boardProps: BoardProps) {
        this.cells = createBoard(boardProps)
    }

    mapRows<T>(callback: (row: Cell[], rowIndex: number) => T): T[] {
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

    flag(row: number, column: number): void {
        const cell = this.cells[row][column]
        if (cell.isHidden) {
            cell.isFlagged = !cell.isFlagged;
        }
    }
}

function createBoard({width, height, mineCount}: BoardProps): Cell[][] {
    if (width <= 0 || height <= 0) return []
    let counter = 0
    let board: Cell[][] = new Array(height)
        .fill(0)
        .map(() =>
            new Array(width)
                .fill(0)
                .map(() =>
                    counter++ < mineCount
                        ? cellStateFactoryMethod(CellType.MINE)
                        : cellStateFactoryMethod(CellType.EMPTY),
                ),
        )
    shuffle(board)
    addProximityValues(board)
    return board
}

function shuffle(array: Cell[][]) {
    let width = array[0].length
    let height = array.length
    let size = width * height
    for (let i = 0; i < size - 1; i++) {
        let randomIndex = getRandomInt(size - i - 1) + i + 1
        // console.log(`for index ${i} swapping ${i} and ${randomIndex}, upper limit is set to ${size - i - 1}`)
        let swapCache = getIndex(array, width, i)
        setIndex(array, width, i, getIndex(array, width, randomIndex))
        setIndex(array, width, randomIndex, swapCache)
    }
}

function addProximityValues(array: Cell[][]) {
    for (let row = 0; row < array.length; row++) {
        for (let column = 0; column < array[0].length; column++) {
            let count = 0

            if (containsMine(array, row - 1, column - 1)) count++
            if (containsMine(array, row, column - 1)) count++
            if (containsMine(array, row + 1, column - 1)) count++
            if (containsMine(array, row - 1, column)) count++
            if (containsMine(array, row + 1, column)) count++
            if (containsMine(array, row - 1, column + 1)) count++
            if (containsMine(array, row, column + 1)) count++
            if (containsMine(array, row + 1, column + 1)) count++

            array[row][column].proximityCount = count
        }
    }
}

function containsMine(array: Cell[][], row: number, column: number) {
    const height = array.length
    const width = array[0].length

    if (row < 0 || row >= height || column < 0 || column >= width) {
        return false
    }

    return array[row][column].containsMine
}

function getIndex(array: Cell[][], width: number, index: number): Cell {
    let i = Math.floor(index / width)
    let j = index % width
    return array[i][j]
}

function setIndex(array: Cell[][], width: number, index: number, value: Cell): void {
    let i = Math.floor(index / width)
    let j = index % width
    array[i][j] = value
}

function getRandomInt(upperLimit: number) {
    return Math.floor(Math.random() * upperLimit)
}

export default Board

