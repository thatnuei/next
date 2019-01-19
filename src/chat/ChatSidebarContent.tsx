import React, { useContext } from "react"
import { Link } from "react-router-dom"
import AppStore from "../app/AppStore"
import routePaths from "../app/routePaths"

const ChatSidebarContent = () => {
  const { channelStore } = useContext(AppStore.Context)
  return (
    <nav>
      <ul>
        {Object.keys(channelStore.joinedChannels).map((id) => (
          <li key={id}>
            <Link to={routePaths.channel(id)}>{id}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
export default ChatSidebarContent
