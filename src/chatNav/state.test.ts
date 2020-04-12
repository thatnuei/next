import { ChatState } from "../chat/ChatState"
import { createChatNavHelpers } from "./state"

test("setting view updates unread state", () => {
  const state = new ChatState()
  const helpers = createChatNavHelpers(state)

  state.channels.update("test", (it) => {
    it.isUnread = true
  })

  state.privateChats.update("test", (it) => {
    it.isUnread = true
  })

  expect(state.channels.get("test").isUnread).toBe(true)
  expect(state.privateChats.get("test").isUnread).toBe(true)

  helpers.setView({ type: "channel", id: "test" })

  expect(state.channels.get("test").isUnread).toBe(false)
  expect(state.privateChats.get("test").isUnread).toBe(true)

  helpers.setView({ type: "privateChat", partnerName: "test" })

  expect(state.channels.get("test").isUnread).toBe(false)
  expect(state.privateChats.get("test").isUnread).toBe(false)
})
