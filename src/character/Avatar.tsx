import clsx from "clsx"
import { getAvatarUrl } from "../flist/helpers"

const sizeClasses = {
  6: clsx`w-6 h-6`,
  8: clsx`w-8 h-8`,
  10: clsx`w-10 h-10`,
  12: clsx`w-12 h-12`,
  24: clsx`w-24 h-24`,
}

type Props = {
  name: string
  size?: keyof typeof sizeClasses
  inline?: boolean
}

function Avatar({ name, size = 24, inline, ...props }: Props) {
  return (
    <img
      src={getAvatarUrl(name)}
      title={name}
      alt=""
      role="presentation"
      className={clsx(sizeClasses[size], inline && `inline`)}
      key={name}
      {...props}
    />
  )
}

export default Avatar
