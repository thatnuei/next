import React from "react"
import { getAvatarUrl } from "../flist/helpers"

type Props = { name: string }

export const Avatar = (props: Props) => (
  <img src={getAvatarUrl(props.name)} alt={`Avatar for ${props.name}`} width={100} height={100} />
)
