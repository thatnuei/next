import { tw } from "twind"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import { TagProps } from "../jsx/types"
import { headerText } from "../ui/components"

function NoRoomView(props: TagProps<"header">) {
	return (
		<header className={tw`flex flex-row items-center p-3`} {...props}>
			<ChatMenuButton className={tw`mr-3`} />
			<h1 className={tw([headerText, tw`opacity-50`])}>next</h1>
		</header>
	)
}

export default NoRoomView
