import "focus-visible"
import ReactDOM from "react-dom"
import { ChatLoggerProvider } from "./logging/context"
import { createWebChatLogger } from "./logging/web"
import Root from "./Root"
import "./tailwind.css"

ReactDOM.createRoot(document.getElementById("root")).render(
	<ChatLoggerProvider logger={createWebChatLogger()}>
		<Root />
	</ChatLoggerProvider>,
)
