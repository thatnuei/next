import React from "react"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { TagProps } from "../jsx/types"

type Props = { name: string } & TagProps<"a">

function CharacterLink({ name, ...props }: Props) {
  return (
    <ExternalLink href={getProfileUrl(name)} data-character={name} {...props} />
  )
}

export default CharacterLink
