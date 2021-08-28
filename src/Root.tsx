import { Provider as JotaiProvider } from "jotai"
import App from "./app/App"
import AppTitle from "./app/AppTitle"
import AppErrorBoundary from "./AppErrorBoundary"
import NotificationToastOverlay from "./notifications/NotificationToastOverlay"
import { RouteProvider } from "./router"

export default function Root() {
  return (
    <AppErrorBoundary>
      <RouteProvider>
        <JotaiProvider>
          <AppTitle />
          <App />
          <NotificationToastOverlay />
        </JotaiProvider>
      </RouteProvider>
    </AppErrorBoundary>
  )
}
