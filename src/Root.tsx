import { Provider as JotaiProvider } from "jotai"
import App from "./app/App"
import AppErrorBoundary from "./AppErrorBoundary"
import { RouteProvider } from "./router"

export default function Root() {
  return (
    <AppErrorBoundary>
      <RouteProvider>
        <JotaiProvider>
          <App />
        </JotaiProvider>
      </RouteProvider>
    </AppErrorBoundary>
  )
}
