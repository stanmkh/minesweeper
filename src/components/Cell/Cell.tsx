import React from 'react'
import './Cell.css'
import CellState from '../../utils/CellState'

export interface CellProps {
    state: CellState
    onclick: () => void
}

export function Cell({state, onclick}: CellProps) {
    let classNames = 'cell'
    let visual
    switch (state) {
        case CellState.MINE:
            classNames += ' mine'
            visual = '*'
            break
        case CellState.NO_MINE:
            classNames += ' no-mine'
            visual = '.'
            break
        case CellState.HIDDEN:
        default:
            visual = '_'
            classNames += ' hidden'
    }
    return (
        <div className={classNames} onClick={onclick}>
            {visual}
        </div>
    )
}
