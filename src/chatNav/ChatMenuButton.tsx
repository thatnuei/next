import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import Drawer from "../ui/Drawer"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import ChatNav from "./ChatNav"

export default function ChatMenuButton() {
	return (
		<Drawer
			side="left"
			renderTrigger={(props) => (
				<Button
					title="Show side menu"
					className={`${fadedButton} block`}
					{...props}
				>
					<Icon which={icons.menu} />
				</Button>
			)}
		>
			<ChatNav />
		</Drawer>
	)
}
