import { navigate, Redirect, RouteComponentProps } from "@reach/router"
import React, { useContext } from "react"
import { Avatar } from "../character/Avatar"
import SessionContainer from "../session/SessionContainer"
import usePersistedState from "../state/usePersistedState"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import routePaths from "./routePaths"

type Props = RouteComponentProps

function CharacterSelectRoute(props: Props) {
  const session = useContext(SessionContainer.Context)
  return session.data ? <View {...session.data} /> : <Redirect to={routePaths.login} />
}
export default CharacterSelectRoute

function View({ account, characters }: { account: string; characters: string[] }) {
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
