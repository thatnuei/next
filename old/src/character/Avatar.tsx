import React from "react"
import tw from "twin.macro"
import { getAvatarUrl } from "../flist/helpers"

type Props = React.ComponentPropsWithoutRef<"img"> & {
  name: string
}

function Avatar({ name, ...props }: Props) {
  return (
    <img
      src={getAvatarUrl(name)}
      title={name}
      alt=""
      role="presentation"
      css={tw`w-24 h-24`}
      key={name}
      {...props}
    />
  )
}

export default Avatar
