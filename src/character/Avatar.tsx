import React from "react"
import { getAvatarUrl } from "../flist/helpers"

type Props = {
  name: string
  size?: number
}

const Avatar = (props: Props) => (
  <img
    src={getAvatarUrl(props.name)}
    alt={`Avatar for ${props.name}`}
    width={props.size || 100}
    height={props.size || 100}
  />
)
export default Avatar
