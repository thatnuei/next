import React from "react"
import { Overlay } from "../overlay/OverlayStore"
import Drawer from "../ui/components/Drawer"
import Navigation from "./components/Navigation"

export const primaryNavigationKey = "primaryNavigation"
export function createPrimaryNavigationDrawer(): Overlay {
  return {
    key: primaryNavigationKey,
    render: (props) => (
      <Drawer side="left" children={<Navigation />} {...props} />
    ),
  }
}
