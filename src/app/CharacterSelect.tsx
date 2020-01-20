import React from "react"
import Avatar from "../character/Avatar"

type Props = {
  identity: string
  characters: string[]
  onIdentityChange: (identity: string) => void
  onSubmit: () => void
  onReturnToLogin: () => void
}

export default function CharacterSelect(props: Props) {
  function handleChange(event: React.ChangeEvent<{ value: string }>) {
    props.onIdentityChange(event.target.value)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    props.onSubmit()
  }

  return (
    <div className="h-full flex p-4">
      <div className="raised-panel m-auto">
        <div className="bg-midnight-800 p-3 text-center">
          <h1 className="font-condensed text-3xl">Select a Character</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <fieldset className="transition-normal">
            <div className="flex flex-col items-center p-4">
              <Avatar
                key={props.identity}
                name={props.identity}
                className="mb-4"
              />

              <select
                className="select"
                name="character"
                value={props.identity}
                onChange={handleChange}
              >
                {props.characters.map((name) => (
                  <option value={name} key={name}>
                    {name}
                  </option>
                ))}
              </select>

              <button className="button-solid" type="submit">
                Enter Chat
              </button>

              <button
                className="anchor"
                type="button"
                onClick={props.onReturnToLogin}
              >
                Return to Login
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  )
}
