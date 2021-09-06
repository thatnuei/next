import App from "./app/App"
import AppErrorBoundary from "./AppErrorBoundary"
import { RouteProvider } from "./router"

export default function Root() {
  return (
    <AppErrorBoundary>
      <RouteProvider>
        <App />
      </RouteProvider>
    </AppErrorBoundary>
  )
}
