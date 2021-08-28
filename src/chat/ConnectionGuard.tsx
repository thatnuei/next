import type { ReactNode } from "react"
import { routes } from "../router"
import type { SocketStatus } from "../socket/SocketStore"
import { solidButton } from "../ui/components"
import LoadingOverlay, { LoadingOverlayText } from "../ui/LoadingOverlay"

export default function ConnectionGuard({
  status,
  children,
}: {
  status: SocketStatus
  children: ReactNode
}) {
  switch (status) {
    case "connecting":
    case "willReconnect":
      return (
        <LoadingOverlay>
          <LoadingOverlayText>Connecting...</LoadingOverlayText>
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
          <a {...routes.login().link} className={solidButton}>
            Return to login
          </a>
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
