import { useEffect } from "react"
import { Listener, ListenerGroup } from "../classes/ListenerGroup"

export function useListener<A extends unknown[]>(
  group: ListenerGroup<A>,
  listener: Listener<A>,
) {
  useEffect(() => group.add(listener), [group, listener])
}
