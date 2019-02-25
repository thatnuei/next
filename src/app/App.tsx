import { observer } from "mobx-react-lite"
import React, { Suspense } from "react"
import { useRootStore } from "../RootStore"

const ChatScreen = React.lazy(() => import("../chat/ChatScreen"))
const CharacterSelectScreen = React.lazy(() =>
  import("./CharacterSelectScreen"),
)
const LoginScreen = React.lazy(() => import("./LoginScreen"))

function App() {
  const { viewStore } = useRootStore()

  const renderScreen = () => {
    switch (viewStore.screen.name) {
      case "init":
        return <p>Setting things up...</p>

      case "login":
        return <LoginScreen />

      case "characterSelect":
        return <CharacterSelectScreen />

      default:
        return <ChatScreen />
    }
  }

  return <Suspense fallback={<p>Loading...</p>}>{renderScreen()}</Suspense>
}

export default observer(App)
