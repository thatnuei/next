import * as mdi from "@mdi/js"
import { Icon as MdiIcon } from "@mdi/react"
import React from "react"
import { styled } from "../styled"
import { getIconSize } from "../theme"

export type IconName = keyof typeof icons

export type IconProps = React.ComponentPropsWithoutRef<"div"> & {
  icon: IconName // TODO: rename to "name"
  color?: string
  size?: number
  faded?: boolean
}

function Icon({ icon, color, size = 1, faded, ...divProps }: IconProps) {
  const path = icons[icon]
  const realSize = getIconSize(size)
  return (
    <IconContainer {...divProps} style={{ opacity: faded ? 0.5 : 1 }}>
      <MdiIcon path={path} color={color} size={realSize} />
    </IconContainer>
  )
}

export default Icon

export const IconContainer = styled.div`
  line-height: 1;
  svg {
    vertical-align: top;
    fill: currentColor;
  }
`

const icons = {
  user: mdi.mdiAccount,
  users: mdi.mdiAccountMultiple,
  updateStatus: mdi.mdiAccountSettings,
  warning: mdi.mdiAlert,
  report: mdi.mdiAlertCircle,
  bookmark: mdi.mdiBookmark,
  checkOutline: mdi.mdiCheckboxBlankOutline,
  checkFilled: mdi.mdiCheckboxMarkedOutline,
  close: mdi.mdiClose,
  console: mdi.mdiCodeTags,
  message: mdi.mdiComment,
  more: mdi.mdiDotsVertical,
  public: mdi.mdiEarth,
  envelope: mdi.mdiEmail,
  channels: mdi.mdiForum,
  heart: mdi.mdiHeart,
  about: mdi.mdiInformation,
  private: mdi.mdiKey,
  link: mdi.mdiLinkVariant,
  lock: mdi.mdiLock,
  lockOpen: mdi.mdiLockOpen,
  logout: mdi.mdiLogout,
  menu: mdi.mdiMenu,
  ignore: mdi.mdiMinusCircle,
  pencil: mdi.mdiPencil,
  refresh: mdi.mdiRefresh,
  settings: mdi.mdiSettings,
  sortAlphabetical: mdi.mdiSortAlphabetical,
  sortNumeric: mdi.mdiSortNumeric,
  pencilSquare: mdi.mdiSquareEditOutline,
}
