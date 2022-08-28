interface Cell {
    containsMine: boolean
    isHidden: boolean
    proximityCount: number
    isFlagged: boolean
    isExplosion: boolean
    isWrong: boolean
}

function initEmptyCell(): Cell {
    return {
        containsMine: false,
        isHidden: true,
        proximityCount: 0,
        isFlagged: false,
        isExplosion: false,
        isWrong: false
    }
}

export enum CellType {
    EMPTY,
    MINE
}

export function cellStateFactoryMethod(cellType: CellType): Cell {
    let cell = initEmptyCell()
    switch (cellType) {
        case CellType.EMPTY:
            break
        case CellType.MINE:
            cell.containsMine = true
            break
    }
    return cell
}

export default Cell