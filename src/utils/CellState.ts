interface CellState {
    containsMine: boolean
    isHidden: boolean
    proximityCount: number
}

export enum CellType {
    EMPTY,
    MINE
}

export function cellStateFactoryMethod(cellType: CellType): CellState {
    switch (cellType) {
        case CellType.EMPTY:
            return {containsMine: false, isHidden: true, proximityCount: 0}
        case CellType.MINE:
            return {containsMine: true, isHidden: true, proximityCount: 0}
    }
}

export default CellState