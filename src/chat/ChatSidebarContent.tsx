import React from "react"
import routePaths from "../app/routePaths"
import { Link } from "../router"

type Props = {
  joinedChannelIds: string[]
}

const ChatSidebarContent = (props: Props) => {
  return (
    <nav>
      <ul>
        {props.joinedChannelIds.map((id) => (
          <li key={id}>
            <Link to={routePaths.channel(id)}>{id}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
export default ChatSidebarContent
