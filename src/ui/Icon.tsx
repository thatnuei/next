import * as mdi from "@mdi/js"
import React from "react"

type Props = React.ComponentPropsWithoutRef<"svg"> & {
  /** Scale is in multiples of 8, default is 3 */
  size?: number
  name: IconName
}

export type IconName = keyof typeof iconPathMap

function Icon({ name, size = 3, ...props }: Props) {
  const realSize = iconSize(size)
  return (
    <svg width={realSize} height={realSize} viewBox="0 0 24 24" {...props}>
      <path d={iconPathMap[name]} css={{ fill: "currentColor" }} />
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

const iconPathMap = {
  about: mdi.mdiInformation,
  bookmark: mdi.mdiBookmark,
  channels: mdi.mdiForum,
  checkFilled: mdi.mdiCheckboxMarkedOutline,
  checkOutline: mdi.mdiCheckboxBlankOutline,
  close: mdi.mdiClose,
  console: mdi.mdiCodeTags,
  envelope: mdi.mdiEmail,
  heart: mdi.mdiHeart,
  ignore: mdi.mdiMinusCircle,
  link: mdi.mdiLinkVariant,
  lock: mdi.mdiLock,
  lockOpen: mdi.mdiLockOpen,
  logout: mdi.mdiLogout,
  menu: mdi.mdiMenu,
  message: mdi.mdiComment,
  more: mdi.mdiDotsVertical,
  pencil: mdi.mdiPencil,
  pencilSquare: mdi.mdiSquareEditOutline,
  private: mdi.mdiKey,
  public: mdi.mdiEarth,
  refresh: mdi.mdiRefresh,
  report: mdi.mdiAlertCircle,
  settings: mdi.mdiSettings,
  sortAlphabetical: mdi.mdiSortAlphabetical,
  sortNumeric: mdi.mdiSortNumeric,
  updateStatus: mdi.mdiAccountSettings,
  user: mdi.mdiAccount,
  users: mdi.mdiAccountMultiple,
  warning: mdi.mdiAlert,
}
