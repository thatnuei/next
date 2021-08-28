import { lazy, Suspense, useState } from "react"
import AppErrorBoundary from "../AppErrorBoundary"
import type { AuthUser } from "../flist/types"
import IslandLayout from "../ui/IslandLayout"
import LoadingOverlay, { LoadingOverlayText } from "../ui/LoadingOverlay"
import Modal from "../ui/Modal"
import AppInfo from "./AppInfo"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

type AppView =
  | { name: "login" }
  | { name: "characterSelect"; user: AuthUser }
  | { name: "chat"; user: AuthUser; identity: string }

const Chat = lazy(() => import("../chat/Chat"))

export default function App() {
  const [view, setView] = useState<AppView>({ name: "login" })

  if (view.name === "login") {
    return (
      <IslandLayout title="Login" isVisible header={<AppInfoModalButton />}>
        <Login
          onSuccess={(user) => {
            setView({ name: "characterSelect", user })
          }}
        />
      </IslandLayout>
    )
  }

  if (view.name === "characterSelect") {
    return (
      <IslandLayout title="Character Select" isVisible>
        <CharacterSelect
          user={view.user}
          onSubmit={(identity) => {
            setView({ name: "chat", user: view.user, identity })
          }}
          onBack={() => {
            setView({ name: "login" })
          }}
        />
      </IslandLayout>
    )
  }

  if (view.name === "chat") {
    return (
      <AppErrorBoundary>
        <Suspense fallback={<ChatFallback />}>
          <Chat user={view.user} identity={view.identity} />
        </Suspense>
      </AppErrorBoundary>
    )
  }

  return null
}

function ChatFallback() {
  return (
    <LoadingOverlay>
      <LoadingOverlayText>Loading...</LoadingOverlayText>
    </LoadingOverlay>
  )
}

function AppInfoModalButton() {
  return (
    <Modal
      title="About next"
      renderTrigger={(t) => (
        <button className="text-center" {...t}>
          <AppInfo.Heading />
          <p className="opacity-75">click for more info</p>
        </button>
      )}
      renderContent={() => (
        <div className="p-4">
          <AppInfo />
        </div>
      )}
    />
  )
}
