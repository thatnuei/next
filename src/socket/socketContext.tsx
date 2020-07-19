import { useMemo } from "react"
import { useRootStore } from "../root/context"
import { useStreamListener } from "../state/stream"
import {
  CommandHandlerFn,
  CommandHandlerMap,
  createCommandHandler,
} from "./commandHelpers"

export function useSocket() {
  const root = useRootStore()
  return root.socket
}

export function useSocketListener(
  handlerArg: CommandHandlerFn | CommandHandlerMap,
) {
  const socket = useSocket()

  const handler = useMemo(
    () =>
      typeof handlerArg === "function"
        ? handlerArg
        : createCommandHandler(handlerArg),
    [handlerArg],
  )

  useStreamListener(socket.commandStream, handler)
}
