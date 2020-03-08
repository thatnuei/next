import { css } from "@emotion/react"
import React from "react"
import { TagProps } from "../jsx/types"
import { bold, inlineBlock, mr } from "../ui/style"
import { genderColors, statusColors } from "./colors"
import { CharacterGender, CharacterStatus } from "./types"

type Props = TagProps<"span"> & {
  name: string
  gender: CharacterGender
  status?: CharacterStatus
}

function CharacterName({ name, gender, status }: Props) {
  return (
    <span>
      {status && (
        <span>•</span>
      )}
      <span>{name}</span>
    </span>
  );
}

export default CharacterName

const upscale = css({ transform: `scale(1.5)` })

const statusDotStyle = css(inlineBlock, mr(1), upscale)
