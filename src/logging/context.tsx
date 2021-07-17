import { createContext, useContext } from "react"
import { raise } from "../common/raise"
import type { ChildrenProps } from "../jsx/types"
import type { ChatLogger } from "./logger"

const Context = createContext<ChatLogger | undefined>(undefined)

export function ChatLoggerProvider(
	props: { logger: ChatLogger } & ChildrenProps,
) {
	return (
		<Context.Provider value={props.logger}>{props.children}</Context.Provider>
	)
}

export function useChatLogger(): ChatLogger {
	return useContext(Context) ?? raise(`ChatLoggerProvider not found`)
}
