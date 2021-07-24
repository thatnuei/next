import { Provider as JotaiProvider } from "jotai"
import App from "./app/App"
import AppErrorBoundary from "./app/AppErrorBoundary"
import AppTitle from "./app/AppTitle"
import NotificationToastOverlay from "./notifications/NotificationToastOverlay"
import { RouteProvider } from "./router"
import { SocketConnection } from "./socket/SocketConnection"

export default function Root() {
	return (
		<AppErrorBoundary>
			<RouteProvider>
				<JotaiProvider>
					<SocketConnection>
						<AppTitle />
						<App />
						<NotificationToastOverlay />
					</SocketConnection>
				</JotaiProvider>
			</RouteProvider>
		</AppErrorBoundary>
	)
}
