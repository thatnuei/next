import clsx from "clsx"
import { Provider as JotaiProvider } from "jotai"
import type { FallbackProps } from "react-error-boundary"
import { ErrorBoundary } from "react-error-boundary"
import AppRoutes from "./app/AppRoutes"
import AppTitle from "./app/AppTitle"
import { toError } from "./common/toError"
import NotificationToastOverlay from "./notifications/NotificationToastOverlay"
import { RouteProvider } from "./router"
import { SocketConnection } from "./socket/SocketConnection"
import { raisedPanel, solidButton } from "./ui/components"

export default function Root() {
	return (
		<ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
			<RouteProvider>
				<JotaiProvider>
					<SocketConnection>
						<AppTitle />
						<AppRoutes />
						<NotificationToastOverlay />
					</SocketConnection>
				</JotaiProvider>
			</RouteProvider>
		</ErrorBoundary>
	)
}

function ErrorBoundaryFallback({ error, resetErrorBoundary }: FallbackProps) {
	const { stack, message } = toError(error)
	return (
		<main className="p-8">
			<div className={clsx(raisedPanel, "p-4 space-y-4")}>
				<h1 className="text-3xl font-condensed">
					oops, something went wrong :(
				</h1>
				<pre className="p-4 overflow-x-auto bg-black/50">
					{stack || message}
				</pre>
				<button className={solidButton} onClick={resetErrorBoundary}>
					Try again
				</button>
			</div>
		</main>
	)
}
