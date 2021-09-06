import type { PropsWithChildren } from "react"
import { useChatContext } from "../chat/ChatContext"
import { useStoreValue } from "../state/store"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"

export default function BBCChannelLink({
  channelId,
  title,
  type,
}: PropsWithChildren<{
  channelId: string
  title: string
  type: "public" | "private"
}>) {
  const context = useChatContext()

  const info = useStoreValue(
    context.channelBrowserStore.selectChannelInfo(channelId),
  )

  return (
    <button
      className="inline-block group"
      onClick={() => context.channelStore.join(channelId, title)}
    >
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
      <span>({info.userCount})</span>
    </button>
  )
}
