import { useEffect } from "react"
import { Channel } from "../classes/Channel"

// TODO: rename to `useChannelListener`
// since we'll want a useChannel that does something else
export function useChannel<L extends (value?: any) => void>(
  channel: Channel<L>,
  listener: L,
) {
  useEffect(() => channel.listen(listener), [channel, listener])
}
