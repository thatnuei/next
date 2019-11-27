import React from "react"
import OverlayShade from "../overlay/OverlayShade"
import OverlaySidePanel from "../overlay/OverlaySidePanel"
import ChatNavigation from "./ChatNavigation"

const ChatNavigationOverlay = () => {
  return (
    <OverlayShade>
      <OverlaySidePanel>
        <ChatNavigation />
      </OverlaySidePanel>
    </OverlayShade>
  )
}

export default ChatNavigationOverlay

ChatNavigationOverlay.key = "ChatNavigationOverlay"
