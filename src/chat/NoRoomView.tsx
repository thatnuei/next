import React from "react"
import tw from "twin.macro"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import { headerText } from "../ui/components"

function NoRoomView() {
  return (
    <header css={tw`flex flex-row items-center p-3`}>
      <ChatMenuButton css={tw`mr-3`} />
      <h1 css={[headerText, tw`opacity-50`]}>next</h1>
    </header>
  )
}

export default NoRoomView
