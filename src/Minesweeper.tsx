import React from 'react'
import Board from './Board'

class Minesweeper extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            width: 10,
            height: 15,
            mineCount: 45,
        }
    }

    render() {
        return (
            <div>
                <form>
                    <label>Width:</label>
                    <input type={'number'} value={this.state.width} onChange={this.changeWidth}/>
                    <label>Height:</label>
                    <input type={'number'} value={this.state.height} onChange={this.changeHeight}/>
                    <label>Mine count:</label>
                    <input type={'number'} value={this.state.mineCount} onChange={this.changeMineCount}/>
                </form>
                <Board width={Number(this.state.width)} height={Number(this.state.height)}
                       mineCount={Number(this.state.mineCount)}/>
            </div>
        )
    }

    changeWidth = (e: any) => {
        this.setState({...this.state, width: e.target.value})
    }

    changeHeight = (e: any) => {
        this.setState({...this.state, height: e.target.value})
    }

    changeMineCount = (e: any) => {
        this.setState({...this.state, mineCount: e.target.value})
    }
}

export default Minesweeper
