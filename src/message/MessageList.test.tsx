import { renderWithProviders } from "../test/renderWithProviders"
import MessageList from "./MessageList"
import { createChannelMessage } from "./MessageState"

it("renders new messages as they come in", async () => {
	const messageText = `awesome message ${Math.random()}`

	const result1 = renderWithProviders(<MessageList messages={[]} />)
	expect(result1.queryByText(messageText)).toBeNull()

	const result2 = renderWithProviders(
		<MessageList
			messages={[
				createChannelMessage("Testificate", messageText),
				createChannelMessage("Testificate", messageText),
				createChannelMessage("Testificate", messageText),
			]}
		/>,
	)
	expect(await result2.findAllByText(messageText)).toHaveLength(3)
})
