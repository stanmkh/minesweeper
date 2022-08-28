import BoardProps from './BoardProps'
import Cell, {cellStateFactoryMethod, CellType} from './Cell'

class Board {

    cells: Cell[][]
    cellRevealCount: number
    props: BoardProps

    constructor(boardProps: BoardProps) {
        this.props = boardProps
        this.cells = createPlaceholderBoard(boardProps)
        this.cellRevealCount = 0
    }

    mapRows<T>(callback: (row: Cell[], rowIndex: number) => T): T[] {
        return this.cells.map(callback)
    }

    revealCell = (row: number, column: number) => {

        if (this.cellRevealCount === 0) {
            this.cells = createRealBoard(this.props, row, column)
        }

        const cell = this.cells[row][column]

        if (!cell.isHidden || cell.isFlagged) {
            return
        }

        if (cell.containsMine) {
            this.endGameWithFailure(row, column)
        }

        cell.isHidden = false
        this.cellRevealCount++

        if (this.allEmptyCellsRevealed()) {
            this.endGameWithSuccess()
        }

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

    private allEmptyCellsRevealed(): boolean {
        const emptyCellsCount = this.props.width * this.props.height - this.props.mineCount
        return this.cellRevealCount === emptyCellsCount
    }

    private endGameWithFailure(row: number, column: number) {
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

    private endGameWithSuccess() {
        this.cells.forEach((row) => row.forEach((
            (cell) => {
                if (cell.isHidden && !cell.isFlagged) {
                    cell.isFlagged = true
                }
            }
        )))
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

function createPlaceholderBoard({width, height}: BoardProps): Cell[][] {
    return new Array(height)
        .fill(0)
        .map(() => new Array(width)
            .fill(cellStateFactoryMethod(CellType.MINE))
        )
}

function createRealBoard({width, height, mineCount}: BoardProps, row: number, column: number): Cell[][] {
    if (width <= 0 || height <= 0) return []
    const lengthOfCellArrayWithoutSafeCell = width * height - 1
    let cells: Cell[] = createCellArray(lengthOfCellArrayWithoutSafeCell, mineCount)
    shuffle(cells)
    insertSafeCell(width, row, column, cells)
    const board = cellArrayToBoard(width, height, cells)
    addProximityValues(board)
    return board
}

function createCellArray(ofLength: number, numberOfMines: number) {
    let counter = 0
    return new Array(ofLength)
        .fill(0)
        .map(() => counter++ < numberOfMines
            ? cellStateFactoryMethod(CellType.MINE)
            : cellStateFactoryMethod(CellType.EMPTY)
        )
}

function cellArrayToBoard(width: number, height: number, array: Cell[]): Cell[][] {
    let board = new Array(height)
        .fill(0)
        .map(() => new Array(width)
            .fill(null)
        )
    array.forEach((cell, index) => {
        board[Math.floor(index / width)][index % width] = cell
    })
    return board
}

function insertSafeCell(width: number, row: number, column: number, cells: Cell[]): void {
    cells.splice(row * width + column, 0, cellStateFactoryMethod(CellType.EMPTY))
}

function shuffle(array: any[]) {
    for (let i = 0; i < array.length - 1; i++) {
        let randomIndex = getRandomInt(array.length - i - 1) + i + 1
        let swapCache = array[randomIndex]
        array[randomIndex] = array[i]
        array[i] = swapCache
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

function getRandomInt(upperLimit: number) {
    return Math.floor(Math.random() * upperLimit)
}

export default Board

