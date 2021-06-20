import { useObservable } from "micro-observables"
import { forwardRef } from "react"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterSummary from "../character/CharacterSummary"
import Button from "../dom/Button"
import type { ComponentProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import { fadedButton } from "../ui/components"
import type { IconProps } from "../ui/Icon";
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import RoomTabList from "./RoomTabList"

export default function ChatNav() {
	const root = useRootStore()
	const identity = useObservable(root.appStore.identity)
	return (
		<nav className={`flex h-full bg-midnight-2`}>
			<div className={`flex flex-col`}>
				<Modal
					title="Channel Browser"
					renderTrigger={(trigger) => (
						<NavAction icon={icons.list} title="Browse channels" {...trigger} />
					)}
				>
					<ChannelBrowser />
				</Modal>

				<Modal
					title="Update Status"
					renderTrigger={(trigger) => (
						<NavAction
							icon={icons.updateStatus}
							title="Update your status"
							{...trigger}
						/>
					)}
				>
					<StatusUpdateForm />
				</Modal>

				<NavAction
					icon={icons.users}
					title="See online friends and bookmarks"
				/>

				<NavAction icon={icons.about} title="About next" />

				<div className={`flex-1`} />

				<NavAction
					icon={icons.logout}
					title="Log out"
					onClick={() => root.appStore.leaveChat()}
				/>
			</div>
			<div className={`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
				<CharacterSummary
					name={identity}
					className={`p-3 mb-1 bg-midnight-0`}
				/>
				<div className={`flex-1`}>
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
		<Button className={`${fadedButton} block p-3`} {...props} ref={ref}>
			<Icon which={icon} />
		</Button>
	)
})
