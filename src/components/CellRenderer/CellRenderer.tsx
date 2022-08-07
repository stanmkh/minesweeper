import React from 'react'
import './CellRenderer.css'
import Cell from '../../utils/Cell'

export interface CellProps {
    state: Cell
    onclick: () => void
}

export function CellRenderer({state, onclick}: CellProps) {
    const {className, visual} = cellStateToRenderData(state)
    return (
        <div className={`cell ${className}`} onClick={onclick}>
            {visual}
        </div>
    )
}

function cellStateToRenderData(cellState: Cell) {
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