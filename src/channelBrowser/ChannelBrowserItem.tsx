import clsx from "clsx"
import Icon from "../ui/Icon"
import { earth, lock } from "../ui/icons"
import type { ChannelBrowserChannel } from "./types"

type Props = {
  info: ChannelBrowserChannel
  active: boolean
  onClick: () => void
}

function ChannelBrowserItem({ info, active, onClick }: Props) {
  const containerClass = clsx`
		flex flex-row items-center px-2 py-2 space-x-2 transition-all w-full
		${active ? `opacity-100 bg-midnight-0` : `opacity-50 hover:opacity-75`}
	`

  return (
    <button className={containerClass} onClick={onClick}>
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
