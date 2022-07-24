import React from "react"
import "./Cell.css"
import CellState from "./utils/CellState"

export interface CellProps {
    state: CellState;
}

export function Cell({state}: CellProps) {
    let classNames = "cell"
    let visual = "."
    switch (state) {
        case CellState.MINE:
            classNames += " mine"
            visual = "*"
            break
    }
    return (
        <div className={classNames}>{visual}</div>
    )
}
