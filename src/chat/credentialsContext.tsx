import { useMemo } from "react"
import createContextWrapper from "../helpers/react/createContextWrapper"
import { ChatCredentials } from "./types"

export const useChatCredentials = createContextWrapper(
  ({ account, ticket, identity }: ChatCredentials) => {
    return useMemo(() => ({ account, ticket, identity }), [
      account,
      identity,
      ticket,
    ])
  },
)
export const ChatCredentialsProvider = useChatCredentials.Provider
