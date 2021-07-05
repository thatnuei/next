import { Provider as JotaiProvider } from "jotai"
import { BrowserRouter } from "react-router-dom"
import App from "./app/App"
import { AuthUserProvider } from "./chat/authUserContext"
import DevTools from "./dev/DevTools"
import ToastListOverlay from "./toast/ToastListOverlay"

export default function Root() {
	return (
		<BrowserRouter>
			<JotaiProvider>
				<AuthUserProvider>
					<App />
					{process.env.NODE_ENV === "development" && <DevTools />}
					<ToastListOverlay />
				</AuthUserProvider>
			</JotaiProvider>
		</BrowserRouter>
	)
}
