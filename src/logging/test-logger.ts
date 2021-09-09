import { raise } from "../common/raise"
import type { MessageState } from "../message/MessageState"
import type { ChatLogger, LoggerRoom } from "./logger"

export function createTestLogger(): ChatLogger {
  const rooms: { [roomId: string]: LoggerRoom } = {}
  const messages: { [roomId: string]: MessageState[] } = {}

  return {
    getRoom(roomId: string): Promise<LoggerRoom> {
      return Promise.resolve(
        rooms[roomId] ?? raise(`Room "${roomId}" not found`),
      )
    },
    getAllRooms(): Promise<LoggerRoom[]> {
      return Promise.resolve(Object.values(rooms))
    },
    setRoomName(roomId: string, name: string): Promise<void> {
      rooms[roomId] = { ...rooms[roomId], id: roomId, name }
      return Promise.resolve()
    },
    addMessage(roomId: string, message: MessageState): Promise<void> {
      messages[roomId] = messages[roomId] || []
      messages[roomId]?.push(message)
      return Promise.resolve()
    },
    getMessages(roomId: string, limit: number): Promise<MessageState[]> {
      const messageList = messages[roomId] || []
      return Promise.resolve(messageList.slice(-limit))
    },
  }
}
