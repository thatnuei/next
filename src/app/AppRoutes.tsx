import { lazy, Suspense, useEffect } from "react"
import { isNonEmptyArray } from "../common/isNonEmptyArray"
import { chatRouteGroup, routes, useRoute } from "../router"
import IslandLayout from "../ui/IslandLayout"
import LoadingOverlay, { LoadingOverlayText } from "../ui/LoadingOverlay"
import Modal from "../ui/Modal"
import { useAccount, useUserCharacters } from "../user"
import AppInfo from "./AppInfo"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"
import LoginRequiredMessage from "./LoginRequiredMessage"

const Chat = lazy(() => import("../chat/Chat"))

export default function AppRoutes() {
	const route = useRoute()
	const account = useAccount()
	const characters = useUserCharacters()

	useEffect(() => {
		if (route.name === false) routes.login().replace()
	}, [route.name])

	return (
		<>
			{route.name === "login" && (
				<IslandLayout title="Login" isVisible header={<AppInfoModalButton />}>
					<Login />
				</IslandLayout>
			)}

			{route.name === "characterSelect" && (
				<>
					{account && isNonEmptyArray(characters) ? (
						<IslandLayout title="Character Select" isVisible>
							<CharacterSelect account={account} characters={characters} />
						</IslandLayout>
					) : (
						<LoginRequiredMessage />
					)}
				</>
			)}

			{chatRouteGroup.has(route) && (
				<Suspense fallback={<ChatFallback />}>
					{account ? <Chat /> : <LoginRequiredMessage />}
				</Suspense>
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
