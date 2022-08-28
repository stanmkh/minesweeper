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

    revealCell = (row: number, column: number) => {
        const cell = this.cells[row][column]

        if (!cell.isHidden || cell.isFlagged) {
            return
        }

        if (cell.containsMine) {
            this.endGame(row, column)
        }

        cell.isHidden = false

        if (!cell.containsMine && cell.proximityCount === 0) {
            this.executeForAllCellsAround<void>(row, column, this.revealCell)
        }
    }

    flag(row: number, column: number): void {
        const cell = this.cells[row][column]
        if (cell.isHidden) {
            cell.isFlagged = !cell.isFlagged
        }
    }

    revealSurrounding(row: number, column: number): void {
        const cell = this.cells[row][column]
        if (!cell.isHidden && !cell.isFlagged) {
            const numberOfFlagsAround = this.calculateNumberOfFlagsAround(row, column)
            if (numberOfFlagsAround === cell.proximityCount) {
                this.executeForAllCellsAround<void>(row, column, this.revealCell)
            }
        }
    }

    private endGame(row: number, column: number) {
        this.cells.forEach((row) => row.forEach((
            (cell) => {
                if (cell.isFlagged && !cell.containsMine) {
                    cell.isWrong = true
                    return
                }
                if (cell.isHidden) {
                    cell.isHidden = false
                    return
                }
            }
        )))
        this.cells[row][column].isExplosion = true
    }

    private calculateNumberOfFlagsAround(row: number, column: number) {
        const flagsAroundMatrix = this.executeForAllCellsAround<boolean>(row, column, this.checkIfFlagged)

        return flagsAroundMatrix.reduce<number>(
            (accumulator, currentValue) => currentValue ? accumulator + 1 : accumulator,
            0,
        )
    }

    private checkIfFlagged = (row: number, column: number): boolean => {
        return this.cells[row][column].isFlagged
    }

    private executeForAllCellsAround<T>(
        row: number,
        column: number,
        handler: (row: number, column: number) => T,
    ): T[] {
        const handlerWrapper = (row: number, column: number): T|null => {
            if (row < 0 || row >= this.cells.length || column < 0 || column >= this.cells[0].length) {
                return null
            }
            return handler(row, column)
        }
        return [
            handlerWrapper(row - 1, column - 1),
            handlerWrapper(row - 1, column),
            handlerWrapper(row - 1, column + 1),
            handlerWrapper(row, column - 1),
            handlerWrapper(row, column + 1),
            handlerWrapper(row + 1, column - 1),
            handlerWrapper(row + 1, column),
            handlerWrapper(row + 1, column + 1),
        ].filter((value) => value != null) as T[]
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

