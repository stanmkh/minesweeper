import React from "react";
import './Cell.css';

export interface CellProps {
    value: number;
}

export function Cell(props: CellProps) {
    let classNames = 'cell';
    if (props.value === 1) classNames += ' mine';
    return (
        <div className={classNames}>{props.value}</div>
    );
}
