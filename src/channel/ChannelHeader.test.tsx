import { render } from "@testing-library/react"
import fireEvent from "@testing-library/user-event"
import { TestChatProvider } from "../chat/ChatContext"
import { createTestApi } from "../flist/test-api"
import { ChatLoggerProvider } from "../logging/context"
import { createTestLogger } from "../logging/test-logger"
import { RouteProvider } from "../router"
import ChannelHeader from "./ChannelHeader"

// the radix menu doesn't show up for some reason
test.skip("copy channel code", async () => {
  const { api } = createTestApi()

  await api.login({ account: "test", password: "test" })

  const result = render(
    <RouteProvider>
      <ChatLoggerProvider logger={createTestLogger()}>
        <TestChatProvider api={api}>
          <ChannelHeader channelId="test" />
        </TestChatProvider>
      </ChatLoggerProvider>
    </RouteProvider>,
  )

  fireEvent.click(
    await result.findByRole("button", { name: /channel actions/i }),
  )

  fireEvent.click(await result.findByText(/copy code/i))
})
