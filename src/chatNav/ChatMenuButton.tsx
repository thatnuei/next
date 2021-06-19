import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton } from "../ui/components"
import Dialog, { DialogButton, DialogDrawerPanel } from "../ui/Dialog"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import ChatNav from "./ChatNav"

function ChatMenuButton() {
	const isMediumScreen = useMediaQuery(`(min-width: 768px)`)

	return isMediumScreen ? null : (
		<Dialog>
			<DialogButton>
				<Button title="Show side menu" className={`${fadedButton} block`}>
					<Icon which={icons.menu} />
				</Button>
			</DialogButton>
			<DialogDrawerPanel side="left">
				<ChatNav />
			</DialogDrawerPanel>
		</Dialog>
	)
}

export default ChatMenuButton
