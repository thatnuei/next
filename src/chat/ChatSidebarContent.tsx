import { Link } from "@reach/router"
import React, { useContext } from "react"
import AppStore from "../app/AppStore"
import routePaths from "../app/routePaths"

const ChatSidebarContent = () => {
  const { channelStore } = useContext(AppStore.Context)
  return (
    <ul>
      {Object.keys(channelStore.joinedChannels).map((id) => (
        <li key={id}>
          <Link to={routePaths.channel(id)}>{id}</Link>
        </li>
      ))}
    </ul>
  )
}
export default ChatSidebarContent
