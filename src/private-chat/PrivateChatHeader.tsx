import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import CharacterNameNew from "../character/CharacterName"
import CharacterStatusDisplay from "../character/CharacterStatusDisplay"
import { Character } from "../character/types"
import HeaderMenuButton from "../chat/HeaderMenuButton"
import {
  alignItems,
  bgMidnight,
  displayNone,
  flex,
  media,
  ml,
  p,
} from "../ui/helpers.new"

type Props = { character: Character }

function PrivateChatHeader({ character }: Props) {
  return (
    <div css={[bgMidnight(700), p(3), flex(), alignItems("center")]}>
      <HeaderMenuButton css={[media.lg(displayNone), ml(-3)]} />
      <Avatar name={character.name} size={50} />
      <div css={[flex("column"), ml(3)]}>
        <CharacterNameNew character={character} />
        <CharacterStatusDisplay {...character} />
      </div>
    </div>
  )
}

export default observer(PrivateChatHeader)
