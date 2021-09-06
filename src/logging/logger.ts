import type { MessageState } from "../message/MessageState"

export type LoggerRoom = {
  readonly id: string
  readonly name: string
}

export type ChatLogger = {
  getRoom(roomId: string): Promise<LoggerRoom>
  getAllRooms(): Promise<LoggerRoom[]>
  setRoomName(roomId: string, name: string): Promise<void>
  addMessage(roomId: string, message: MessageState): Promise<void>
  getMessages(roomId: string, limit: number): Promise<MessageState[]>
}
