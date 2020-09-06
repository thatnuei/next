import { AnimatePresence } from "framer-motion"
import { useObservable } from "micro-observables"
import React from "react"
import Chat from "../chat/Chat"
import { useRootStore } from "../root/context"
import LoadingOverlay from "../ui/LoadingOverlay"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export default function App() {
  const root = useRootStore()
  const screen = useObservable(root.appStore.screen)
  const status = useObservable(root.socket.status)

  return (
    <AnimatePresence exitBeforeEnter>
      {screen === "login" && <Login key="login" />}
      {screen === "characterSelect" && (
        <CharacterSelect key="characterSelect" />
      )}
      {screen === "chat" && (
        <>
          {status === "online" && <Chat key="chat" />}
          {status === "connecting" && (
            <LoadingOverlay key="loading" text="Connecting..." />
          )}
          {status === "identifying" && (
            <LoadingOverlay key="loading" text="Identifying..." />
          )}
        </>
      )}
    </AnimatePresence>
  )
}
