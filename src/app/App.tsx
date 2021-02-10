import { useObservable } from "micro-observables"
import Chat from "../chat/Chat"
import { useRootStore } from "../root/context"
import FadeTransition from "../ui/FadeTransition"
import IslandLayout from "../ui/IslandLayout"
import LoadingOverlay from "../ui/LoadingOverlay"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export default function App() {
	const root = useRootStore()
	const screen = useObservable(root.appStore.screen)
	const status = useObservable(root.socket.status)

	return (
		<>
			<IslandLayout title="Login" isVisible={screen === "login"}>
				<Login />
			</IslandLayout>

			<IslandLayout
				title="Select a character"
				isVisible={screen === "characterSelect"}
			>
				<CharacterSelect />
			</IslandLayout>

			<FadeTransition
				isVisible={screen === "chat" && status === "online"}
				delayedEntry
			>
				<Chat />
			</FadeTransition>

			<FadeTransition isVisible={status === "connecting"} delayedEntry>
				<LoadingOverlay text="Connecting..." />
			</FadeTransition>

			<FadeTransition isVisible={status === "identifying"} delayedEntry>
				<LoadingOverlay text="Identifying..." />
			</FadeTransition>
		</>
	)
}
