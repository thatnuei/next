import App from "./app/App"
import AppErrorBoundary from "./app/AppErrorBoundary"

export default function Root() {
	return (
		<AppErrorBoundary>
			<App />
		</AppErrorBoundary>
	)
}
