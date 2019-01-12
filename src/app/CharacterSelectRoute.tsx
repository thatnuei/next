import { navigate, Redirect, RouteComponentProps } from "@reach/router"
import React, { useContext, useEffect, useState } from "react"
import Avatar from "../character/Avatar"
import { fetchCharacters } from "../flist/api"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import ModalBody from "../ui/ModalBody"
import ModalOverlay from "../ui/ModalOverlay"
import ModalTitle from "../ui/ModalTitle"
import AppStore from "./AppStore"
import { identityStorageKey } from "./constants"
import routePaths from "./routePaths"

type Props = RouteComponentProps

function CharacterSelectRoute(props: Props) {
  const { user } = useContext(AppStore.Context)
  const [identity, setIdentity] = useState<string>()
  const [characters, setCharacters] = useState<string[]>()

  useEffect(() => {
    if (!user) return

    const loadCharacters = async () => {
      try {
        const { characters } = await fetchCharacters(user.account, user.ticket)
        setCharacters(characters)
      } catch (error) {
        console.warn("Error fetching characters:", error)
        navigate(routePaths.login)
      }
    }
    loadCharacters()
  }, [])

  useEffect(
    () => {
      if (!user || !characters) return

      if (!identity) {
        const loadedIdentity = window.sessionStorage.getItem(identityStorageKey(user.account))
        setIdentity(loadedIdentity || characters[0])
      }

      window.sessionStorage.setItem(identityStorageKey(user.account), identity || characters[0])
    },
    [identity, characters],
  )

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setIdentity(event.target.value)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    navigate(routePaths.chat)
  }

  if (!user) return <Redirect to={routePaths.login} />

  const content =
    identity && characters ? (
      <form onSubmit={handleSubmit} style={formStyle}>
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
      </form>
    ) : (
      <p css={{ textAlign: "center" }}>Loading characters...</p>
    )

  return (
    <ModalOverlay>
      <ModalTitle>Select a Character</ModalTitle>
      <ModalBody>{content}</ModalBody>
    </ModalOverlay>
  )
}
export default CharacterSelectRoute

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}
