import React from "react"
import { SessionState } from "./SessionState"

const context = React.createContext(new SessionState())

export const SessionProvider = context.Provider
export const SessionConsumer = context.Consumer
