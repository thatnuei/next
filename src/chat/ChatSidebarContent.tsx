import { observer } from "mobx-react-lite"
import React, { useContext } from "react"
import routePaths from "../app/routePaths"
import { Link } from "../router"
import ChatStore from "./ChatStore"

const ChatSidebarContent = () => {
  const { channelStore } = useContext(ChatStore.Context)

  return (
    <nav>
      <ul>
        {channelStore.getJoinedChannels().map(({ id, name }) => (
          <li key={id}>
            <Link to={routePaths.channel(id)}>{name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
export default observer(ChatSidebarContent)
