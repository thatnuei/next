import React from "react"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"

type Props = { name: string } & TagProps<"button">

function CharacterMenuTarget({ name, ...props }: Props) {
  return <Button data-character={name} {...props} />
}

export default CharacterMenuTarget
