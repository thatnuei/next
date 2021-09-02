import { Provider as JotaiProvider } from "jotai"
import App from "./app/App"
import AppErrorBoundary from "./AppErrorBoundary"
import NotificationToastOverlay from "./notifications/NotificationToastOverlay"
import { RouteProvider } from "./router"

export default function Root() {
  return (
    <AppErrorBoundary>
      <RouteProvider>
        <JotaiProvider>
          <App />
          <NotificationToastOverlay />
        </JotaiProvider>
      </RouteProvider>
    </AppErrorBoundary>
  )
}
