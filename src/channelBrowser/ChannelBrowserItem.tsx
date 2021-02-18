import { useObservable } from "micro-observables"
import { tw } from "twind"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import Icon from "../ui/Icon"
import { earth, lock } from "../ui/icons"
import { ChannelBrowserChannel } from "./ChannelBrowserStore"

type Props = TagProps<"button"> & {
	info: ChannelBrowserChannel
}

function ChannelBrowserItem({ info, ...props }: Props) {
	const root = useRootStore()
	const isJoined = useObservable(root.channelStore.isJoined(info.id))

	const handleClick = () => {
		if (isJoined) {
			root.channelStore.leave(info.id)
		} else {
			root.channelStore.join(info.id, info.title)
		}
	}

	const containerStyle = tw(
		tw`flex flex-row items-center px-2 py-2 space-x-2 transition-all`,
		isJoined ? tw`opacity-100 bg-midnight-0` : tw`opacity-50 hover:opacity-75`,
	)

	return (
		<button className={containerStyle} onClick={handleClick} {...props}>
			<Icon which={info.type === "public" ? earth : lock} />
			<div
				className={tw(`flex-1 overflow-hidden whitespace-nowrap`, {
					textOverflow: "ellipsis",
				})}
				dangerouslySetInnerHTML={{ __html: info.title }}
			/>
			<div className={tw`w-12 text-right`}>{info.userCount}</div>
		</button>
	)
}

export default ChannelBrowserItem
