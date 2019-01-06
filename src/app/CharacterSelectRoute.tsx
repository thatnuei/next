import { navigate } from "@reach/router"
import React from "react"
import { Avatar } from "../character/Avatar"
import { SessionData } from "../session/SessionContainer"
import usePersistedState from "../state/usePersistedState"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import routePaths from "./routePaths"

type Props = {
  sessionData: SessionData
}

function CharacterSelectRoute(props: Props) {
  const { account, characters } = props.sessionData

  const [identity, setIdentity] = usePersistedState<string>(
    `${account}:identity`,
    characters[0] || "",
  )

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setIdentity(event.target.value)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    navigate(routePaths.chat, { state: { identity } })
  }

  return (
    <Overlay>
      <ContentContainer>
        <HeaderText>Select a Character</HeaderText>
        <Form onSubmit={handleSubmit} style={formStyle}>
          <FormField>
            <Avatar key={identity} name={identity} />
          </FormField>
          <FormField>
            <select name="character" value={identity} onChange={handleChange}>
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
export default CharacterSelectRoute

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const ContentContainer = styled.div`
  background-color: ${flist3};
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
`
