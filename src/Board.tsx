import React from 'react'
import {Cell} from './Cell'

export interface BoardProps {
    width: number;
    height: number;
    mineCount: number;
}

export function Board(props: BoardProps) {
    console.log(props)
    let board: number[][] = generateGameBoard(props.width, props.height, props.mineCount)
    let boardDom = board.map((row, i) =>
        <div key={i} className={'row'}>
            {row.map((value, j) => <Cell key={j} value={value}/>)}
        </div>,
    )
    return (
        <div>{boardDom}</div>
    )
}

function generateGameBoard(width: number, height: number, minesCount: number): number[][] {
    if (width <= 0 || height <= 0) return []
    let counter = 0
    let board: number[][] = new Array(height)
        .fill(0)
        .map(() =>
            new Array(width)
                .fill(0)
                .map(() => counter++ < minesCount ? 1 : 0),
        )
    shuffle(board)
    return board
}

function shuffle(array: number[][]) {
    let width = array[0].length
    let height = array.length
    let size = width * height
    for (let i = 0; i < size - 1; i++) {
        let randomIndex = getRandomInt(size - i - 1) + i + 1
        // console.log(`for index ${i} swapping ${i} and ${randomIndex}, upper limit is set to ${size - i - 1}`);
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

export default Board