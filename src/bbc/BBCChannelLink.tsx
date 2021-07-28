import type { PropsWithChildren } from "react"
import { useChannelActions } from "../channel/state"
import { useChannelUserCount } from "../channelBrowser/state"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"

export default function BBCChannelLink({
	id,
	title,
	type,
}: PropsWithChildren<{
	id: string
	title: string
	type: "public" | "private"
}>) {
	const userCount = useChannelUserCount(id)
	const { join } = useChannelActions(id)

	return (
		<button className="group inline-block" onClick={() => join(title)}>
			<span className="opacity-75">
				<Icon
					which={type === "public" ? icons.earth : icons.lock}
					size={5}
					inline
				/>
			</span>
			<span
				className={`underline group-hover:no-underline`}
				dangerouslySetInnerHTML={{ __html: title }}
			/>{" "}
			<span>({userCount})</span>
		</button>
	)
}
