import React from "react"
import { flexCenter } from "../helpers"
import { styled } from "../styled"
import { getThemeColor, spacing } from "../theme"

type Props = {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
}

const ModalPanelHeader = (props: Props) => {
  const hasSides = props.left || props.right

  const content = hasSides ? (
    <>
      <HeaderSlot>{props.left}</HeaderSlot>
      <HeaderCenter>{props.center}</HeaderCenter>
      <HeaderSlot>{props.right}</HeaderSlot>
    </>
  ) : (
      <HeaderCenter>{props.center}</HeaderCenter>
    )

  return <Header>{content}</Header>
}

export default ModalPanelHeader

const Header = styled.div`
  background-color: ${getThemeColor("theme1")};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const HeaderSlot = styled.div`
  width: 50px;
  height: 50px;
  ${flexCenter};
`

const HeaderCenter = styled.div`
  flex: 1;
  text-align: center;
  padding: ${spacing.small};
`
