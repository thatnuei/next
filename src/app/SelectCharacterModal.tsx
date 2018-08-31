import { Formik, FormikProps } from "formik"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { getAvatarUrl } from "../flist/helpers"
import { SessionState } from "../session/SessionState"
import { Button } from "../ui/Button"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Modal } from "../ui/Modal"
import { styled } from "../ui/styled"

type FormValues = {
  character: string
}

type Props = {
  session: SessionState
}

@observer
export class SelectCharacterModal extends React.Component<Props> {
  @observable
  lastCharacter?: string

  @action
  loadLastCharacter() {
    this.lastCharacter =
      localStorage.getItem("lastCharacter") || this.props.session.user.characters[0]
  }

  componentDidMount() {
    this.loadLastCharacter()
  }

  render() {
    return (
      <Modal>
        <ContentContainer>
          <HeaderText>Select a Character</HeaderText>
          {this.lastCharacter ? (
            <Formik<FormValues>
              initialValues={{
                character: this.lastCharacter,
              }}
              render={this.renderForm}
              onSubmit={this.handleSubmit}
            />
          ) : null}
        </ContentContainer>
      </Modal>
    )
  }

  private renderForm = (props: FormikProps<FormValues>) => {
    const formStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }

    return (
      <Form onSubmit={props.handleSubmit} style={formStyle}>
        <FormField>
          <img
            key={props.values.character}
            src={getAvatarUrl(props.values.character)}
            width={100}
            height={100}
          />
        </FormField>
        <FormField>
          <select
            name="character"
            value={props.values.character}
            onChange={(event) => this.handleChange(event, props)}
          >
            {this.props.session.user.characters.map((name) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
          </select>
        </FormField>
        <Button type="submit">Enter Chat</Button>
      </Form>
    )
  }

  private handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    props: FormikProps<FormValues>,
  ) => {
    localStorage.setItem("lastCharacter", event.target.value)
    props.handleChange(event)
  }

  private handleSubmit = (values: FormValues) => {
    const { socket, user } = this.props.session
    const { account, ticket } = user
    socket.connect(
      account,
      ticket,
      values.character,
    )
  }
}

const ContentContainer = styled.div`
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
`
