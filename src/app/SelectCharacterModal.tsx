import { Formik, FormikProps } from "formik"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { Avatar } from "../character/Avatar"
import { navigationStore } from "../navigation/NavigationStore"
import { chatScreen } from "../navigation/screens"
import { sessionStore } from "../session/SessionStore"
import { socketStore } from "../socket/SocketStore"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"

type FormValues = {
  character: string
}

@observer
export class SelectCharacterModal extends React.Component {
  @observable
  lastCharacter?: string

  @action
  loadLastCharacter() {
    this.lastCharacter = localStorage.getItem("lastCharacter") || sessionStore.characters[0]
  }

  componentDidMount() {
    this.loadLastCharacter()
  }

  render() {
    return (
      <Overlay>
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
      </Overlay>
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
          <Avatar key={props.values.character} name={props.values.character} />
        </FormField>
        <FormField>
          <select
            name="character"
            value={props.values.character}
            onChange={(event) => this.handleChange(event, props)}
          >
            {sessionStore.characters.map((name) => (
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
    socketStore.connect(
      sessionStore.account,
      sessionStore.ticket,
      values.character,
      () => {
        navigationStore.replace(chatScreen())
      },
    )
  }
}

const ContentContainer = styled.div`
  background-color: ${flist3};
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
`
