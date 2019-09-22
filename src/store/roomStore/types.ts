type RoomBase<T extends string> = {
  type: T
  id: string
  title: string
  // messages: Message[]
  chatboxInput: string
  isUnread: boolean
}

export type Room = ConsoleRoom

export type ConsoleRoom = RoomBase<"console">
