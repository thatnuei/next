import React from "react"
import { getAvatarUrl } from "../flist/helpers"
import { size } from "../ui/style"

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
      {...props} />
  );
}

export default Avatar
