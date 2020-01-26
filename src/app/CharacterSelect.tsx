import React from "react"
import Avatar from "../character/Avatar"
import { anchor, buttonSolid, input, raisedPanel } from "../ui/components"
import {
  absoluteCover,
  alignItems,
  bgMidnight,
  flex,
  fontCondensed,
  h,
  m,
  mb,
  p,
  textCenter,
  textSize,
} from "../ui/helpers.new"

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
    <div css={[absoluteCover, flex("column"), p(4)]}>
      <div css={[raisedPanel, m("auto")]}>
        <header css={[bgMidnight(800), p(3), textCenter]}>
          <h1 css={[fontCondensed, textSize("xl3")]}>Select a Character</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div css={[flex("column"), alignItems("center"), p(4)]}>
              <Avatar name={props.identity} size={100} />
              <div css={h(4)} />

              <select
                css={[input, mb(4)]}
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

              <button css={[buttonSolid, mb(4)]} type="submit">
                Enter Chat
              </button>

              <button
                css={anchor}
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
