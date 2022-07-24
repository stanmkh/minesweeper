import React from 'react'
import {Cell} from './Cell'
import BoardProps from './utils/BoardProps'
import Board from './utils/Board'

export function BoardRenderer(props: BoardProps) {
    console.log(props)
    let board: Board = new Board(props)
    let boardDom = board.mapRows((row, i) =>
        <div key={i} className={'row'}>
            {row.map((value, j) => <Cell key={j} state={value}/>)}
        </div>,
    )
    return (
        <div>{boardDom}</div>
    )
}

export default BoardRenderer