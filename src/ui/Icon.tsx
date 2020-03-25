import React from "react"
import tw from "twin.macro"

export type IconProps = React.ComponentPropsWithoutRef<"svg"> & {
  which: string
}

function Icon({ which, ...props }: IconProps) {
  return (
    <svg css={tw`w-5 h-5`} viewBox="0 0 24 24" {...props}>
      <path d={which} css={{ fill: "currentColor" }} />
    </svg>
  )
}

export default Icon
