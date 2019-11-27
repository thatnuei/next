import React from "react"
import FadedButton from "../../ui/components/FadedButton"
import Icon, { IconName } from "../../ui/components/Icon"
import { spacing } from "../../ui/theme"

type Props = {
  title: string
  icon: IconName
  onClick?: () => void
}

function NavigationAction({ title, icon, onClick }: Props) {
  const style = { padding: spacing.small }
  return (
    <FadedButton title={title} onClick={onClick} css={style}>
      <Icon icon={icon} />
    </FadedButton>
  )
}

export default NavigationAction
