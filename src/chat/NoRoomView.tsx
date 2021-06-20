import ChatMenuButton from "../chatNav/ChatMenuButton"
import type { TagProps } from "../jsx/types"
import { headerText } from "../ui/components"

function NoRoomView(props: TagProps<"header">) {
	return (
		<header className={`flex flex-row items-center p-3 space-x-3`} {...props}>
			<ChatMenuButton />
			<h1 className={`${headerText} opacity-50`}>next</h1>
		</header>
	)
}

export default NoRoomView
