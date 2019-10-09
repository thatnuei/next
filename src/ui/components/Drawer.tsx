import React from "react"
import { FocusOn } from "react-focus-on"
import { focusOnFillFix, fullscreen } from '../helpers'
import { styled } from '../styled'
import { getThemeColor } from '../theme'

type Props = {
  visible: boolean
  children: React.ReactNode
  side: DrawerSide
  onClose?: () => void
}

type DrawerSide = 'left' | 'right'

function Drawer(props: Props) {
  return <Shade visible={props.visible}>
    <Panel visible={props.visible} side={props.side}>
      <FocusOn
        enabled={props.visible}
        onEscapeKey={props.onClose}
        onClickOutside={props.onClose}
      >
        {props.children}
      </FocusOn>
    </Panel>
  </Shade>
}

export default Drawer

const Shade = styled.div<{ visible: boolean }>`
  ${fullscreen};

  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.3s;

  ${({ visible }) =>
    visible
      ? { opacity: 1, visibility: "visible" }
      : { opacity: 0, visibility: "hidden" }}
`

const Panel = styled.div<{ visible: boolean, side: DrawerSide }>`
  background-color: ${getThemeColor("theme2")};
  position: absolute;
  ${props => props.side}: 0;
  top: 0;
  bottom: 0;

  transition: 0.3s transform;

  ${({ visible, side }) =>
    visible
      ? { transform: `translateX(0)` }
      : { transform: `translateX(${side === 'left' ? -100 : 100}%)` }}

  ${focusOnFillFix};
`