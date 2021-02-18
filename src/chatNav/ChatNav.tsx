import { useObservable } from "micro-observables"
import { forwardRef } from "react"
import { tw } from "twind"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterSummary from "../character/CharacterSummary"
import Button from "../dom/Button"
import { ComponentProps, TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import { fadedButton } from "../ui/components"
import Icon, { IconProps } from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal, { ModalButton, ModalPanel } from "../ui/Modal.new"
import RoomTabList from "./RoomTabList"

export default function ChatNav(props: TagProps<"nav">) {
	const root = useRootStore()
	const identity = useObservable(root.appStore.identity)
	return (
		<nav className={tw`flex h-full`}>
			<div className={tw`flex flex-col`}>
				<Modal>
					<ModalButton>
						<NavAction icon={icons.list} title="Browse channels" />
					</ModalButton>
					<ModalPanel title="Channel browser">
						<ChannelBrowser />
					</ModalPanel>
				</Modal>

				<NavAction
					icon={icons.updateStatus}
					title="Update your status"
					onClick={root.statusUpdateStore.show}
				/>

				<NavAction
					icon={icons.users}
					title="See online friends and bookmarks"
				/>

				<NavAction icon={icons.about} title="About next" />

				<div className={tw`flex-1`} />

				<NavAction
					icon={icons.logout}
					title="Log out"
					onClick={root.appStore.leaveChat}
				/>
			</div>
			<div className={tw`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
				<CharacterSummary
					name={identity}
					className={tw`p-3 mb-1 bg-midnight-0`}
				/>
				<div className={tw`flex-1`}>
					<RoomTabList />
				</div>
			</div>
		</nav>
	)
}

type NavActionProps = ComponentProps<typeof Button> & {
	icon: IconProps["which"]
}

const NavAction = forwardRef(function NavAction(
	{ icon, ...props }: NavActionProps,
	ref: React.Ref<HTMLButtonElement>,
) {
	return (
		<Button className={tw`${fadedButton} block p-3`} {...props} ref={ref}>
			<Icon which={icon} />
		</Button>
	)
})
