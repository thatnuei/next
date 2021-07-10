import ChatMenuButton from "../chatNav/ChatMenuButton"

export function ScreenHeader({ children }: { children: React.ReactNode }) {
	return (
		<header className={`flex flex-row items-center p-3 gap-3`}>
			<ChatMenuButton />
			<div className="flex-1">{children}</div>
		</header>
	)
}
