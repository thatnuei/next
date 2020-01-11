import { useEffect } from "react"
import { Channel } from "../classes/Channel"

export function useChannel<L extends (value?: any) => void>(
  channel: Channel<L>,
  listener: L,
) {
  useEffect(() => channel.listen(listener), [channel, listener])
}
