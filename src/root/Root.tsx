import App from "../app/App"
import DevTools from "../app/DevTools"

export default function Root() {
	return (
		<>
			<App />
			{process.env.NODE_ENV === "development" && <DevTools />}
		</>
	)
}
