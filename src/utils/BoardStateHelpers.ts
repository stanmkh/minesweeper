import BoardProps from './BoardProps'
import CellState from './CellState'

export function createRandomRevealedBoard({width, height, mineCount}: BoardProps): CellState[][] {
    if (width <= 0 || height <= 0) return []
    let counter = 0
    let board: CellState[][] = new Array(height)
        .fill(0)
        .map(() =>
            new Array(width)
                .fill(0)
                .map(() => counter++ < mineCount ? CellState.MINE : CellState.NO_MINE),
        )
    shuffle(board)
    return board
}

export function createHiddenBoard({width, height}: BoardProps): CellState[][] {
    if (width <= 0 || height <= 0) return []
    return new Array(height)
        .fill(0)
        .map(() =>
            new Array(width)
                .fill(CellState.HIDDEN)
        )
}

function shuffle(array: CellState[][]) {
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

function getIndex(array: number[][], width: number, index: number): number {
    let i = Math.floor(index / width)
    let j = index % width
    return array[i][j]
}

function setIndex(array: number[][], width: number, index: number, value: number): void {
    let i = Math.floor(index / width)
    let j = index % width
    array[i][j] = value
}

function getRandomInt(upperLimit: number) {
    return Math.floor(Math.random() * upperLimit)
}