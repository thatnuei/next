import { mdiMenu } from "@mdi/js"
import React from "react"
import MediaQuery from "react-responsive"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import { chatSidebarBreakpoint } from "./breakpoints"
import { chatViewStore } from "./ChatViewStore"

export const ChatSidebarToggle = () => (
  <MediaQuery maxWidth={chatSidebarBreakpoint}>
    <Button flat onClick={chatViewStore.sidebarDisplay.enable}>
      <Icon path={mdiMenu} />
    </Button>
  </MediaQuery>
)
