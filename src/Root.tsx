import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import App from "./app/App"
import DevTools from "./dev/DevTools"
import ToastCard from "./toast/ToastCard"
import ToastProvider from "./toast/ToastProvider"

export default function Root() {
	return (
		<BrowserRouter>
			<RecoilRoot>
				<ToastProvider>
					<App />
					{process.env.NODE_ENV === "development" && <DevTools />}
					<ToastCard type="info" duration={1000}>
						hey
					</ToastCard>
					<ToastCard type="warning" duration={2000}>
						hey
					</ToastCard>
					<ToastCard type="success" duration={3000}>
						hey
					</ToastCard>
				</ToastProvider>
			</RecoilRoot>
		</BrowserRouter>
	)
}
