import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import App from "./app/App"
import DevTools from "./dev/DevTools"

export default function Root() {
	return (
		<BrowserRouter>
			<RecoilRoot>
				<App />
				{process.env.NODE_ENV === "development" && <DevTools />}
			</RecoilRoot>
		</BrowserRouter>
	)
}
