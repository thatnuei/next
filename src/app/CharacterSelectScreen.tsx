import { bind } from "decko"
import { Formik, FormikProps } from "formik"
import { observer } from "mobx-react"
import React from "react"
import { Avatar } from "../character/Avatar"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"

type FormValues = {
  character: string
}

type CharacterSelectScreenProps = {
  characters: string[]
  onSubmit: (character: string) => void
}

@observer
export class CharacterSelectScreen extends React.Component<CharacterSelectScreenProps> {
  private initialValues = {
    character: this.props.characters[0],
  }

  render() {
    return (
      <Overlay>
        <ContentContainer>
          <HeaderText>Select a Character</HeaderText>
          <Formik<FormValues>
            initialValues={this.initialValues}
            render={this.renderForm}
            onSubmit={this.handleSubmit}
          />
        </ContentContainer>
      </Overlay>
    )
  }

  @bind
  private renderForm(props: FormikProps<FormValues>) {
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
          <select name="character" value={props.values.character} onChange={props.handleChange}>
            {this.props.characters.map((name) => (
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

  @bind
  private handleSubmit(values: FormValues) {
    this.props.onSubmit(values.character)
  }
}

const ContentContainer = styled.div`
  background-color: ${flist3};
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
`
