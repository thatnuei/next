import { BrowserRouter } from "react-router-dom"
import App from "./app/App"
import DevTools from "./dev/DevTools"

export default function Root() {
	return (
		<BrowserRouter>
			<App />
			{process.env.NODE_ENV === "development" && <DevTools />}
		</BrowserRouter>
	)
}
