import React from "react"
import { Overlay } from "../overlay/OverlayStore"
import Drawer from "../ui/components/Drawer"
import Modal from "../ui/components/Modal"
import ChannelBrowser from "./ChannelBrowser"
import ChannelDescription from "./ChannelDescription"
import ChannelMenu from "./ChannelMenu"
import ChannelModel from "./ChannelModel"

export function createChannelBrowserModal(): Overlay {
  return {
    key: "channelBrowser",
    render: (props) => (
      <Modal
        title="Channels"
        panelWidth={400}
        panelHeight={600}
        children={<ChannelBrowser />}
        {...props}
      />
    ),
  }
}

export function createChannelMenuDrawer(channel: ChannelModel): Overlay {
  return {
    key: "channelMenu",
    render: (props) => (
      <Drawer
        side="right"
        children={<ChannelMenu channel={channel} />}
        {...props}
      />
    ),
  }
}

export function createChannelDescriptionModal(channel: ChannelModel): Overlay {
  return {
    key: "channelDescription",
    render: (props) => (
      <Modal
        title={channel.name}
        fillMode="contained"
        children={<ChannelDescription channel={channel} />}
        panelWidth={1200}
        panelHeight={600}
        {...props}
      />
    ),
  }
}
