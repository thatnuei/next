import { mdiClose } from "@mdi/js"
import React from "react"
import { Avatar } from "../character/Avatar"
import { flist4 } from "../ui/colors"
import { Icon } from "../ui/Icon"
import { css, styled } from "../ui/styled"

export interface ChatNavigationTabProps {
  text: string
  active?: boolean
  icon?: string
  avatar?: string
  onActivate?: () => void
  onClose?: () => void
}

export class ChatNavigationTab extends React.Component<ChatNavigationTabProps> {
  render() {
    return (
      <Container {...this.props}>
        <TitleContainer {...this.props} onMouseDown={this.handleActivate}>
          {this.props.icon && (
            <IconContainer>
              <Icon path={this.props.icon} />
            </IconContainer>
          )}

          {this.props.avatar && (
            <IconContainer>
              <Avatar name={this.props.avatar} size={24} />
            </IconContainer>
          )}

          <TitleText>{this.props.text}</TitleText>
        </TitleContainer>
        {this.props.onClose && (
          <CloseButton {...this.props} onMouseDown={this.handleClose}>
            <Icon path={mdiClose} size={0.8} />
          </CloseButton>
        )}
      </Container>
    )
  }

  private handleActivate = () => {
    this.props.onActivate && this.props.onActivate()
  }

  private handleClose = () => {
    this.props.onClose && this.props.onClose()
  }
}

const Container = styled.div<ChatNavigationTabProps>`
  display: flex;
  align-items: stretch;

  background-color: ${(props) => (props.active ? flist4 : "transparent")};
`

const inactiveStyle = css`
  opacity: 0.3;

  &:hover {
    opacity: 0.6;
  }
`

const TitleContainer = styled.a.attrs({ href: "#" })<ChatNavigationTabProps>`
  flex-grow: 1;

  display: flex;
  align-items: center;

  padding: 8px;

  ${(props) => (props.active ? "" : inactiveStyle)};
`

const IconContainer = styled.div`
  margin-right: 8px;
`

const TitleText = styled.div`
  /* fixes vertial alignment */
  position: relative;
  top: 1px;
`

const CloseButton = styled.a.attrs({ href: "#" })<ChatNavigationTabProps>`
  flex-shrink: 0;

  padding: 8px;

  display: flex;
  align-items: center;

  ${inactiveStyle};
`
