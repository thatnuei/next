import { mdiAccountEdit, mdiForum, mdiLogout, mdiSettings } from "@mdi/js"
import Icon from "@mdi/react"
import React from "react"
import { clouds } from "../ui/colors"
import { styled } from "../ui/styled"

export class ChatActions extends React.Component {
  render() {
    return (
      <Container>
        <section>
          <Action title="Channels" icon={mdiForum} />
          <Action title="Update Status" icon={mdiAccountEdit} />
          <Action title="Settings" icon={mdiSettings} />
        </section>
        <section>
          <Action title="Log out" icon={mdiLogout} />
        </section>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 100%;
`

const Action = (props: { title: string; icon: string }) => (
  <ActionAnchor title={props.title}>
    <Icon path={props.icon} size={1.5} color={clouds} />
  </ActionAnchor>
)

const ActionAnchor = styled.a.attrs({ href: "#" })`
  opacity: 0.5;

  &:hover {
    opacity: 0.75;
  }

  padding: 0.4rem;
  display: block;
`
