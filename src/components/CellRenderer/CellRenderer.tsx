import React, {MouseEventHandler} from 'react'
import './CellRenderer.css'
import Cell from '../../utils/Cell'

export interface CellProps {
    state: Cell
    onclick: () => void
    oncontextmenu: (e: any) => void //todo change any to something more specific
}

function CellRenderer({state, onclick, oncontextmenu}: CellProps) {
    const {className, visual} = cellStateToRenderData(state)
    return (
        <div className={`cell ${className}`} onClick={onclick} onContextMenu={oncontextmenu}>
            {visual}
        </div>
    )
}

function cellStateToRenderData(cellState: Cell) {
    if (cellState.isFlagged) {
        return {visual: 'F', className: 'flagged'}
    }
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

export default CellRenderer