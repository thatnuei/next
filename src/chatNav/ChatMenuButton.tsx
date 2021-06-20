import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton } from "../ui/components"
import Drawer from "../ui/Drawer"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import ChatNav from "./ChatNav"

export default function ChatMenuButton() {
	const isMediumScreen = useMediaQuery(`(min-width: 768px)`)
	return isMediumScreen ? null : (
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
