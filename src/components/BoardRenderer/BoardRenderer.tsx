import React from 'react'
import {CellRenderer} from '../CellRenderer/CellRenderer'
import Board from '../../utils/Board'
import BoardProps from '../../utils/BoardProps'
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
        let cellClickCallback = (row: number, column: number) => {
            this.state.board.revealCell(row, column)
            this.setState({...this.state})
        }
        let boardDom = this.state.board.mapRows((row, rowIndex) =>
            <div key={rowIndex} className={'row'}>
                {
                    row.map(
                        (value, columnIndex) => <CellRenderer
                            key={columnIndex}
                            state={value}
                            onclick={() => cellClickCallback(rowIndex, columnIndex)}
                        />,
                    )
                }
            </div>,
        )
        return (
            <div>{boardDom}</div>
        )
    }
}

export default BoardRenderer