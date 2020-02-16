import * as mdi from "@mdi/js"
import React from "react"

type Props = React.ComponentPropsWithoutRef<"svg"> & {
  /** Scale is in multiples of 8, default is 3 */
  size?: number
  name: IconName
}

export type IconName = keyof typeof iconPathMap

function Icon({ name, size = 3, ...props }: Props) {
  return (
    <svg width={size * 8} height={size * 8} viewBox="0 0 24 24" {...props}>
      <path d={iconPathMap[name]} css={{ fill: "currentColor" }} />
    </svg>
  )
}

export default Icon

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
