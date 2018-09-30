import React from "react"
import { Avatar } from "../character/Avatar"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"

type Props = {
  characters: string[]
  onSubmit: (character: string) => void
}

type State = {
  selected: string
}

export class CharacterSelectScreen extends React.Component<Props, State> {
  state: State = {
    selected: this.props.characters[0] || "",
  }

  render() {
    const formStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }

    const { selected } = this.state

    return (
      <Overlay>
        <ContentContainer>
          <HeaderText>Select a Character</HeaderText>
          <Form onSubmit={this.handleSubmit} style={formStyle}>
            <FormField>
              <Avatar key={selected} name={selected} />
            </FormField>
            <FormField>
              <select name="character" value={selected} onChange={this.handleChange}>
                {this.props.characters.map((name) => (
                  <option value={name} key={name}>
                    {name}
                  </option>
                ))}
              </select>
            </FormField>
            <Button type="submit">Enter Chat</Button>
          </Form>
        </ContentContainer>
      </Overlay>
    )
  }

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      selected: event.target.value,
    })
  }

  private handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    this.props.onSubmit(this.state.selected)
  }
}

const ContentContainer = styled.div`
  background-color: ${flist3};
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
`
