import { useChannelActions, useIsChannelJoined } from "../channel/state"
import type { TagProps } from "../jsx/types"
import Icon from "../ui/Icon"
import { earth, lock } from "../ui/icons"
import type { ChannelBrowserChannel } from "./types"

type Props = TagProps<"button"> & {
  info: ChannelBrowserChannel
}

function ChannelBrowserItem({ info, ...props }: Props) {
  const isJoined = useIsChannelJoined(info.id)
  const { join, leave } = useChannelActions(info.id)

  const handleClick = () => {
    if (isJoined) {
      leave()
    } else {
      join(info.title)
    }
  }

  const containerClass = `
		flex flex-row items-center px-2 py-2 space-x-2 transition-all
		${isJoined ? `opacity-100 bg-midnight-0` : `opacity-50 hover:opacity-75`}
	`

  return (
    <button className={containerClass} onClick={handleClick} {...props}>
      <Icon which={info.type === "public" ? earth : lock} />
      <div
        className="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis"
        dangerouslySetInnerHTML={{ __html: info.title }}
      />
      <div className={`w-12 text-right`}>{info.userCount}</div>
    </button>
  )
}

export default ChannelBrowserItem
