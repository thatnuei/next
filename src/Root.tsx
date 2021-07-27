import { Provider as JotaiProvider } from "jotai"
import AppRoutes from "./app/AppRoutes"
import AppTitle from "./app/AppTitle"
import AppErrorBoundary from "./AppErrorBoundary"
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
						<AppRoutes />
						<NotificationToastOverlay />
					</SocketConnection>
				</JotaiProvider>
			</RouteProvider>
		</AppErrorBoundary>
	)
}
