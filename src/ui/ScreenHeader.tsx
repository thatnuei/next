import ChatMenuButton from "../chatNav/ChatMenuButton"
import { headerText } from "./components"

export function ScreenHeader({ children }: { children: React.ReactNode }) {
	return (
		<header className={`flex flex-row items-center p-3 gap-3`}>
			<ChatMenuButton />
			<h1 className={headerText}>{children}</h1>
		</header>
	)
}
