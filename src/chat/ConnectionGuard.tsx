import type { ReactNode } from "react"
import { routes } from "../router"
import { useSocketStatus } from "../socket/SocketConnection"
import { solidButton } from "../ui/components"
import LoadingOverlay, { LoadingOverlayText } from "../ui/LoadingOverlay"

export default function ConnectionGuard({ children }: { children: ReactNode }) {
  const status = useSocketStatus()

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
