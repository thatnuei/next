import App from "../app/App"
import DevTools from "../app/DevTools"
import { ThemeProvider } from "../ui/theme"

export default function Root() {
	return (
		<ThemeProvider>
			<App />
			{process.env.NODE_ENV === "development" && <DevTools />}
		</ThemeProvider>
	)
}
