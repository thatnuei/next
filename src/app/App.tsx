import { lazy, Suspense, useState } from "react"
import type { AuthUser } from "../flist/types"
import IslandLayout from "../ui/IslandLayout"
import LoadingOverlay, { LoadingOverlayText } from "../ui/LoadingOverlay"
import Modal from "../ui/Modal"
import AppErrorBoundary from "./AppErrorBoundary"
import AppInfo from "./AppInfo"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

const Chat = lazy(() => import("../chat/Chat"))

type AppView =
	| { name: "login" }
	| { name: "characterSelect"; user: AuthUser }
	| { name: "chat"; user: AuthUser; identity: string }

export default function App() {
	const [view, setView] = useState<AppView>({ name: "login" })

	return (
		<>
			{view.name === "login" && (
				<IslandLayout title="Login" isVisible header={<AppInfoModalButton />}>
					<Login
						onSuccess={(user) => setView({ name: "characterSelect", user })}
					/>
				</IslandLayout>
			)}

			{view.name === "characterSelect" && (
				<IslandLayout title="Character Select" isVisible>
					<CharacterSelect
						account={view.user.account}
						characters={view.user.characters}
						onSubmit={(character) =>
							setView({ name: "chat", user: view.user, identity: character })
						}
						onReturnToLogin={() => setView({ name: "login" })}
					/>
				</IslandLayout>
			)}

			{view.name === "chat" && (
				<AppErrorBoundary>
					<Suspense fallback={<ChatFallback />}>
						<Chat {...view} />
					</Suspense>
				</AppErrorBoundary>
			)}
		</>
	)
}

function ChatFallback() {
	return (
		<LoadingOverlay>
			<LoadingOverlayText>Loading...</LoadingOverlayText>
		</LoadingOverlay>
	)
}

function AppInfoModalButton() {
	return (
		<Modal
			title="About next"
			renderTrigger={(t) => (
				<button className="text-center" {...t}>
					<AppInfo.Heading />
					<p className="opacity-75">click for more info</p>
				</button>
			)}
			renderContent={() => (
				<div className="p-4">
					<AppInfo />
				</div>
			)}
		/>
	)
}
