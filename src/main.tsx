import "focus-visible"
import { configure } from "mobx"
import ReactDOM from "react-dom"
import "virtual:windi.css"
import { ChatLoggerProvider } from "./logging/context"
import { createWebChatLogger } from "./logging/web"
import Root from "./Root"
import "./styles.css"

configure({
  observableRequiresReaction: true,
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChatLoggerProvider logger={createWebChatLogger()}>
    <Root />
  </ChatLoggerProvider>,
)
