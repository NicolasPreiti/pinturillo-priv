export interface IChatMessage {
  author: string
  message: string
}
export type IChatMessages = Array<IChatMessage>