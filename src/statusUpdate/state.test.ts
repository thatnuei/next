import { ChatState } from "../chat/ChatState"
import { createStatusCommandHandler } from "./state"

test("accepts status timeout variable in seconds", () => {
  const state = new ChatState()
  const handle = createStatusCommandHandler(state, "Testificate")

  handle({ type: "VAR", params: { variable: "sta_flood", value: 5 } })

  expect(state.statusUpdate.timeout).toBe(5000)
})
