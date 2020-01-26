import React from "react"
import useInput from "../dom/hooks/useInput"
import { buttonSolid, input, raisedPanel } from "../ui/components"
import FormField from "../ui/components/FormField"
import {
  absoluteCover,
  bgMidnight,
  flex,
  fontCondensed,
  m,
  maxW,
  mb,
  mt,
  opacity,
  p,
  textCenter,
  textSize,
  transition,
} from "../ui/helpers.new"

type Props = {
  disabled: boolean
  error: string | undefined
  onSubmit: (account: string, password: string) => void
}

function Login({ disabled, error, onSubmit }: Props) {
  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit(account.value, password.value)
  }

  return (
    <div css={[absoluteCover, flex(), p(4)]}>
      <div css={[raisedPanel, m("auto")]}>
        <header css={[bgMidnight(800), p(3), textCenter]}>
          <h1 css={[fontCondensed, textSize("xl3")]}>Login</h1>
        </header>

        <form css={p(4)} onSubmit={handleSubmit}>
          <fieldset
            disabled={disabled}
            css={[transition("opacity"), disabled && opacity(50)]}
          >
            <FormField labelText="Username" css={mb(3)}>
              <input
                css={input}
                name="username"
                placeholder="awesome username"
                required
                {...account.bind}
              />
            </FormField>

            <FormField labelText="Password" css={mb(3)}>
              <input
                css={input}
                name="password"
                type="password"
                placeholder="••••••••"
                required
                {...password.bind}
              />
            </FormField>

            <button css={buttonSolid} type="submit">
              Submit
            </button>
          </fieldset>

          {error ? <p css={[mt(4), maxW("xs"), textCenter]}>{error}</p> : null}
        </form>
      </div>
    </div>
  )
}

export default Login
