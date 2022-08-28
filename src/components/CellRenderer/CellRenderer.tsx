import React, {MouseEventHandler} from 'react'
import './CellRenderer.css'
import Cell from '../../logic/Cell'

export interface CellProps {
    state: Cell
    onClick: () => void
    onRightMouseClick: () => void
    onMiddleMouseClick: () => void
}

function CellRenderer({state, onClick, onRightMouseClick, onMiddleMouseClick}: CellProps) {
    const {className, visual} = cellStateToRenderData(state)
    return (
        <div
            className={`cell ${className}`}
            onClick={onClick}
            onContextMenu={onContextMenyWrapperProvider(onRightMouseClick)}
            onMouseDown={middleButtonClickWrapperProvider(onMiddleMouseClick)} //middle mouse click handler
        >
            {visual}
        </div>
    )
}

function onContextMenyWrapperProvider(handler: () => void): MouseEventHandler<HTMLDivElement> {
    return function (event) {
        event.preventDefault()
        handler()
    }
}

function middleButtonClickWrapperProvider(handler: () => void): MouseEventHandler<HTMLDivElement> {
    return function (event) {
        if (event.button === 1) {
            event.preventDefault()
            handler()
        }
    }
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