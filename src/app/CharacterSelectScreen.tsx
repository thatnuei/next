import { bind } from "decko"
import { observer } from "mobx-react"
import React from "react"
import { Avatar } from "../character/Avatar"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"

type CharacterSelectScreenProps = {
  selectedCharacter: string
  characters: string[]
  onSelectedCharacterChange: (character: string) => void
  onSubmit: () => void
}

@observer
export class CharacterSelectScreen extends React.Component<CharacterSelectScreenProps> {
  render() {
    const { characters, selectedCharacter, onSelectedCharacterChange } = this.props

    const onCharacterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onSelectedCharacterChange(event.target.value)
    }

    const formStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }

    return (
      <Overlay>
        <ContentContainer>
          <HeaderText>Select a Character</HeaderText>
          <Form onSubmit={this.handleSubmit} style={formStyle}>
            <FormField>
              <Avatar key={selectedCharacter} name={selectedCharacter} />
            </FormField>
            <FormField>
              <select name="character" value={selectedCharacter} onChange={onCharacterChange}>
                {characters.map((name) => (
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

  @bind
  private handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    this.props.onSubmit()
  }
}

const ContentContainer = styled.div`
  background-color: ${flist3};
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
`
