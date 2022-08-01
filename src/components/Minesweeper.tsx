import React from 'react'
import BoardRenderer from './BoardRenderer/BoardRenderer'

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
                <BoardRenderer width={this.state.width} height={this.state.height}
                               mineCount={this.state.mineCount}/>
            </div>
        )
    }

    changeWidth = (e: any) => {
        this.setState({...this.state, width: Number(e.target.value)})
    }

    changeHeight = (e: any) => {
        this.setState({...this.state, height: Number(e.target.value)})
    }

    changeMineCount = (e: any) => {
        this.setState({...this.state, mineCount: Number(e.target.value)})
    }
}

export default Minesweeper
