import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { CharacterStatus } from "../character/types"
import { NavigationScreen } from "../navigation/NavigationStore"
import { sessionStore } from "../session/SessionStore"
import { Button } from "../ui/Button"
import { flist4 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { TextArea } from "../ui/TextArea"

type Props = {
  onSubmit: () => void
}

@observer
export class UpdateStatusForm extends React.Component<Props> {
  @observable
  private status: CharacterStatus = sessionStore.identityCharacter.status

  @observable
  private statusMessage = sessionStore.identityCharacter.statusMessage

  render() {
    return (
      <Container>
        <Title>Update Status</Title>
        <Form onSubmit={this.handleSubmit}>
          <FormField labelText="Status" htmlFor="status">
            <select name="status" value={this.status} onChange={this.handleStatusChange}>
              <option value="online">Online</option>
              <option value="looking">Looking</option>
              <option value="busy">Busy</option>
              <option value="away">Away</option>
              <option value="dnd">Do Not Disturb</option>
            </select>
          </FormField>
          <FormField labelText="Status message" htmlFor="statusMessage">
            <TextArea value={this.statusMessage} onChange={this.handleStatusMessageChange} />
          </FormField>
          <Button>Submit</Button>
        </Form>
      </Container>
    )
  }

  @action.bound
  private handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.status = event.target.value as CharacterStatus // unsafe, figure out a better way
  }

  @action.bound
  private handleStatusMessageChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.statusMessage = event.target.value
  }

  @action.bound
  private handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    sessionStore.updateStatus(this.status, this.statusMessage)
    this.props.onSubmit()
  }
}

const Container = styled.div`
  padding: 1rem;
  background-color: ${flist4};
`

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`

export const updateStatusOverlay = (): NavigationScreen => ({
  key: "status",
  render: ({ close }) => (
    <Overlay onShadeClick={close}>
      <UpdateStatusForm onSubmit={close} />
    </Overlay>
  ),
})
