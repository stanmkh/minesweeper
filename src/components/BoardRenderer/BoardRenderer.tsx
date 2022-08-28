import React from 'react'
import CellRenderer from '../CellRenderer/CellRenderer'
import Board from '../../logic/Board'
import BoardProps from '../../logic/BoardProps'
import './BoardRenderer.css'

interface BoardRendererState {
    board: Board
}

class BoardRenderer extends React.Component<BoardProps, BoardRendererState> {
    constructor(props: BoardProps) {
        super(props)
        this.state = {
            board: new Board(props),
        }
    }

    componentDidUpdate(prevProps: Readonly<BoardProps>, prevState: Readonly<BoardRendererState>, snapshot?: any) {
        if (prevProps !== this.props) {
            this.setState({ ...this.state, board: new Board(this.props)})
        }
    }

    render() {
        let boardDom = this.state.board.mapRows((row, rowIndex) =>
            <div key={rowIndex} className={'row'}>
                {
                    row.map(
                        (value, columnIndex) => <CellRenderer
                            key={columnIndex}
                            state={value}
                            onClick={() => this.cellClickCallback(rowIndex, columnIndex)}
                            onRightMouseClick={() => this.cellRightClickCallback(rowIndex, columnIndex)}
                            onMiddleMouseClick={() => this.cellMiddleClickCallback(rowIndex, columnIndex)}
                        />,
                    )
                }
            </div>,
        )
        return (
            <div>{boardDom}</div>
        )
    }

    private cellClickCallback = (row: number, column: number) => {
        this.state.board.revealCell(row, column)
    }

    private cellRightClickCallback = (row: number, column: number) => {
        this.state.board.flag(row, column)
    }

    private cellMiddleClickCallback = (row: number, column: number) => {
        this.state.board.revealSurrounding(row, column)
    }
}

export default BoardRenderer