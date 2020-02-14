import React, { useState } from "react"

type Props = {
  characters: string[]
  initialCharacter: string
  onSubmit: (character: string) => void
}

function CharacterSelect(props: Props) {
  const [character, setCharacter] = useState(props.initialCharacter)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    props.onSubmit(character)
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={character} onChange={(e) => setCharacter(e.target.value)}>
        {props.characters.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
      <button type="submit">Enter chat</button>
    </form>
  )
}

export default CharacterSelect
