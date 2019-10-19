import React from "react"
import { Overlay } from "../overlay/OverlayStore"
import Drawer from "../ui/components/Drawer"
import Modal from "../ui/components/Modal"
import Navigation from "./components/Navigation"
import UpdateStatusForm from "./UpdateStatus"

export const primaryNavigationKey = "primaryNavigation"
export function createPrimaryNavigationDrawer(): Overlay {
  return {
    key: primaryNavigationKey,
    render: (props) => (
      <Drawer side="left" children={<Navigation />} {...props} />
    ),
  }
}

export const updateStatusModalKey = "updateStatus"
export function createUpdateStatusModal(): Overlay {
  return {
    key: updateStatusModalKey,
    render: (props) => (
      <Modal
        title="Update Status"
        panelWidth={500}
        panelHeight={350}
        {...props}
      >
        <UpdateStatusForm />
      </Modal>
    ),
  }
}
