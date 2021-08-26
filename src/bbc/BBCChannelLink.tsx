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
    <span className={`inline-flex items-baseline`}>
      <span className={`self-center inline w-4 h-4 mr-1 opacity-75`}>
        <Icon which={type === "public" ? icons.earth : icons.lock} />
      </span>
      <button className="group" onClick={() => join(title)}>
        <span
          className={`underline group-hover:no-underline`}
          dangerouslySetInnerHTML={{ __html: title }}
        />{" "}
        <span>({userCount})</span>
      </button>
    </span>
  )
}
