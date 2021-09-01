import type { ReactNode } from "react"
import Button from "../dom/Button"
import { useStoreValue } from "../state/store"
import { solidButton } from "../ui/components"
import LoadingOverlay, { LoadingOverlayText } from "../ui/LoadingOverlay"
import { useChatContext } from "./ChatContext"

export default function SocketStatusGuard({
  children,
}: {
  children: ReactNode
}) {
  const context = useChatContext()
  const status = useStoreValue(context.socket.status)

  switch (status) {
    case "connecting":
      return (
        <LoadingOverlay>
          <LoadingOverlayText>Connecting...</LoadingOverlayText>
        </LoadingOverlay>
      )

    case "willReconnect":
      return (
        <LoadingOverlay>
          <LoadingOverlayText>
            Failed to connect, reconnecting...
          </LoadingOverlayText>
        </LoadingOverlay>
      )

    case "identifying":
      return (
        <LoadingOverlay>
          <LoadingOverlayText>Identifying...</LoadingOverlayText>
        </LoadingOverlay>
      )

    case "closed":
      return (
        <ConnectionMessage message="The connection was closed by the server.">
          <Button className={solidButton} onClick={context.showLogin}>
            Return to login
          </Button>
        </ConnectionMessage>
      )
  }

  if (status !== "online") {
    return null
  }

  return <>{children}</>
}

function ConnectionMessage(props: { message: string; children?: ReactNode }) {
  return (
    <>
      <p>{props.message}</p>
      {props.children}
    </>
  )
}
