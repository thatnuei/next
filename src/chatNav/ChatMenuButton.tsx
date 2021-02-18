import { tw } from "twind"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton } from "../ui/components"
import Dialog, { DialogButton, DialogDrawerPanel } from "../ui/Dialog"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import ChatNav from "./ChatNav"

function ChatMenuButton() {
	const isMediumScreen = useMediaQuery(`(min-width: ${tw.theme("screens.md")})`)

	return isMediumScreen ? null : (
		<Dialog>
			<DialogButton>
				<Button title="Show side menu" className={tw`${fadedButton} block`}>
					<Icon which={icons.menu} />
				</Button>
			</DialogButton>
			<DialogDrawerPanel>
				<ChatNav />
			</DialogDrawerPanel>
		</Dialog>
	)
}

export default ChatMenuButton
