import { observer } from "mobx-react"
import React from "react"
import { appStore } from "../app/AppStore"
import { getProfileUrl } from "../flist/helpers"
import { styled } from "../ui/styled"
import { genderColors, statusColors } from "./colors"

type Props = {
  name: string
}

@observer
export class CharacterName extends React.Component<Props> {
  render() {
    const { name, gender, status } = appStore.characterStore.getCharacter(this.props.name)
    const genderColor = genderColors[gender]
    const statusColor = statusColors[status]

    return (
      <Container href={getProfileUrl(name)} target="_blank" rel="noopener noreferrer">
        <StatusDot color={statusColor} />
        <Name color={genderColor}>{name}</Name>
      </Container>
    )
  }
}

const Container = styled.a`
  display: inline-flex;
  align-items: baseline;
  vertical-align: baseline;
`

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  background-color: ${(props: { color: string }) => props.color};
  border-radius: 50%;
  align-self: center;

  margin-right: 0.2rem;
`

const Name = styled.span`
  color: ${(props: { color: string }) => props.color};
`
