import { observer } from "mobx-react"
import React from "react"
import { css, styled } from "../ui/styled"
import { ChannelModel } from "./ChannelModel"

export interface ChannelFilterProps {
  channel: ChannelModel
}

@observer
export class ChannelFilter extends React.Component<ChannelFilterProps> {
  render() {
    const { channel } = this.props

    if (channel.mode === "both") {
      return (
        <Container>
          <FilterLink active={channel.filter === "both"} onClick={() => channel.setFilter("both")}>
            Both
          </FilterLink>
          <FilterLink active={channel.filter === "chat"} onClick={() => channel.setFilter("chat")}>
            Chat
          </FilterLink>
          <FilterLink active={channel.filter === "ads"} onClick={() => channel.setFilter("ads")}>
            Ads
          </FilterLink>
        </Container>
      )
    }

    return (
      <Container disabled>
        <FilterLink>Both</FilterLink>
        <FilterLink active={channel.mode === "chat"}>Chat</FilterLink>
        <FilterLink active={channel.mode === "ads"}>Ads</FilterLink>
      </Container>
    )
  }
}

const inactiveStyle = css`
  opacity: 0.4;

  &:hover {
    opacity: 0.7;
  }

  transition: 0.3s opacity;
`

const FilterLink = styled.a.attrs({ href: "#" })<{ active?: boolean }>`
  padding: 0.3rem 0.7rem;
  ${(props) => (props.active ? "" : inactiveStyle)};
`

const disabledStyle = css`
  opacity: 0.5;
  pointer-events: none;
`

const Container = styled.div<{ disabled?: boolean }>`
  ${(props) => props.disabled && disabledStyle};
  transition: 0.3s opacity;
`
