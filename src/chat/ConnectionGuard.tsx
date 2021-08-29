import type { ReactNode } from "react"
import Button from "../dom/Button"
import type { SocketStatus } from "../socket/SocketStore"
import { solidButton } from "../ui/components"
import LoadingOverlay, { LoadingOverlayText } from "../ui/LoadingOverlay"

export default function ConnectionGuard({
  status,
  children,
  onLogout,
}: {
  status: SocketStatus
  children: ReactNode
  onLogout: () => void
}) {
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
          <Button className={solidButton} onClick={onLogout}>
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
