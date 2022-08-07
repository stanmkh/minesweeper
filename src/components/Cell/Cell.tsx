import React from 'react'
import './Cell.css'
import CellState from '../../utils/CellState'

export interface CellProps {
    state: CellState
    onclick: () => void
}

export function Cell({state, onclick}: CellProps) {
    const {className, visual} = cellStateToRenderData(state)
    return (
        <div className={`cell ${className}`} onClick={onclick}>
            {visual}
        </div>
    )
}

function cellStateToRenderData(cellState: CellState) {
    if (cellState.isHidden) {
        return {visual: '?', className: 'hidden'}
    }
    if (cellState.containsMine) {
        return {visual: '*', className: 'mine'}
    }
    if (cellState.proximityCount === 0) {
        return {visual: '_', className: 'empty'}
    }
    return {visual: cellState.proximityCount.toString(), className: 'proximity'}
}