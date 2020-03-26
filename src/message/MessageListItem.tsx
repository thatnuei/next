import { css } from "@emotion/react"
import { rgba } from "polished"
import React from "react"
import tw from "twin.macro"
import CharacterName from "../character/CharacterName"
import { Character } from "../character/types"
import { emerald, tomato } from "../ui/theme.old"
import { MessageType } from "./types"

type Props = {
  sender?: Character
  text: string
  timestamp: number
  type: MessageType
}

export default function MessageListItem(props: Props) {
  const typeStyle = {
    normal: undefined,
    lfrp: lfrpStyle,
    admin: adminStyle,
    system: systemStyle,
  }[props.type]

  return (
    <div css={[tw`px-3 py-2`, typeStyle]}>
      <span css={messageStyle}>
        {new Date(props.timestamp).toLocaleTimeString()}
      </span>

      {props.sender && (
        <span css={tw`inline-block mr-2`}>
          <CharacterName {...props.sender} />
        </span>
      )}

      <span>{props.text}</span>
    </div>
  )
}

const messageStyle = tw`inline-block float-right ml-3 text-sm opacity-50`
const lfrpStyle = css({ backgroundColor: rgba(emerald, 0.2) })
const adminStyle = css({ backgroundColor: rgba(tomato, 0.2) })
const systemStyle = tw`bg-shade`
