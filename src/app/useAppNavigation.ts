import { useMemo, useState } from "react"
import createContextWrapper from "../common/createContextWrapper"

type Screen = { name: "login" } | { name: "characterSelect" } | { name: "chat" }

const useAppNavigation = createContextWrapper(() => {
  const [screen, setScreen] = useState<Screen>({ name: "login" })

  return useMemo(
    () => ({
      screen,
      showLogin: () => setScreen({ name: "login" }),
      showCharacterSelect: () => setScreen({ name: "characterSelect" }),
      showChat: () => setScreen({ name: "chat" }),
    }),
    [screen],
  )
})
export default useAppNavigation