export interface ICanvasInfo {
  width: number
  height: number
  points: ICoords[]
  strokeColor: string
}

export interface ICoords {
  x: number
  y: number
}

export interface IMousePosition {
  coords: ICoords
  color: string
}