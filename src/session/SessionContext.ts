import React from "react"
import { SessionStore } from "./SessionStore"

const context = React.createContext(new SessionStore())

export const SessionProvider = context.Provider
export const SessionConsumer = context.Consumer
