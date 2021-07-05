import { Provider as JotaiProvider } from "jotai"
import { BrowserRouter } from "react-router-dom"
import App from "./app/App"
import DevTools from "./dev/DevTools"
import ToastList from "./toast/ToastList"

export default function Root() {
	return (
		<BrowserRouter>
			<JotaiProvider>
				<App />
				{process.env.NODE_ENV === "development" && <DevTools />}
				<ToastList />
			</JotaiProvider>
		</BrowserRouter>
	)
}
