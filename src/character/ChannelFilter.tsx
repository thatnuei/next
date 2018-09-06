import { observer } from "mobx-react"
import React from "react"
import { ChannelModel } from "../channel/ChannelModel"
import { css, styled } from "../ui/styled"

export interface ChannelFilterProps {
  channel: ChannelModel
}

@observer
export class ChannelFilter extends React.Component<ChannelFilterProps> {
  render() {
    const { channel } = this.props

    if (channel.mode === "both") {
      return (
        <div>
          <FilterLink active={channel.filter === "both"} onClick={() => channel.setFilter("both")}>
            Both
          </FilterLink>
          <FilterLink active={channel.filter === "chat"} onClick={() => channel.setFilter("chat")}>
            Chat
          </FilterLink>
          <FilterLink active={channel.filter === "ads"} onClick={() => channel.setFilter("ads")}>
            Ads
          </FilterLink>
        </div>
      )
    }

    return (
      <Disabled>
        <FilterLink>Both</FilterLink>
        <FilterLink active={channel.mode === "chat"}>Chat</FilterLink>
        <FilterLink active={channel.mode === "ads"}>Ads</FilterLink>
      </Disabled>
    )
  }
}

const inactiveStyle = css`
  opacity: 0.4;

  &:hover {
    opacity: 0.7;
  }
`

const FilterLink = styled.a.attrs({ href: "#" })<{ active?: boolean }>`
  padding: 0.3rem 0.7rem;
  ${(props) => (props.active ? "" : inactiveStyle)};
`

const Disabled = styled.div`
  opacity: 0.5;
  pointer-events: none;
`
