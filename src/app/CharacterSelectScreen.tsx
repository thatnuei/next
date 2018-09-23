import { bind } from "decko"
import { action, observable, runInAction } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { Avatar } from "../character/Avatar"
import { StoredValue } from "../helpers/StoredValue"
import { appStore } from "../store"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"

const storedLastCharacter = new StoredValue<string>("lastCharacter")

@observer
export class CharacterSelectScreen extends React.Component {
  @observable
  private selectedCharacter = ""

  async componentDidMount() {
    const { characters } = appStore.userStore
    const lastCharacter = (await storedLastCharacter.load()) || characters[0] || ""
    runInAction("setCharacter", () => {
      this.selectedCharacter = lastCharacter
    })
  }

  render() {
    const { characters } = appStore.userStore
    const { selectedCharacter, handleChange } = this

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
              <select name="character" value={selectedCharacter} onChange={handleChange}>
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

  @action.bound
  private handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.selectedCharacter = event.target.value
    storedLastCharacter.save(event.target.value)
  }

  @bind
  private handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const { credentials } = appStore.userStore
    if (!credentials) {
      appStore.appRouterStore.setRoute("login")
      return
    }

    appStore.connectToChat(credentials.account, credentials.ticket, this.selectedCharacter)
  }
}

const ContentContainer = styled.div`
  background-color: ${flist3};
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
`
