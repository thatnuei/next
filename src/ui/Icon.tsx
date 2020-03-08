import React from "react"

export type IconProps = React.ComponentPropsWithoutRef<"svg"> & {
  which: string

  /** Scale is in multiples of 8, default is 3 */
  size?: number
}

function Icon({ which, size = 3, ...props }: IconProps) {
  const realSize = iconSize(size)
  return (
    <svg width={realSize} height={realSize} viewBox="0 0 24 24" {...props}>
      <path d={which} />
    </svg>
  )
}

export default Icon

/**
 * Get the actual pixel size of an icon from units
 *
 * Useful if we need to make other icon-sized things without guessing
 */
export const iconSize = (units: number) => `${units * 8}px`
