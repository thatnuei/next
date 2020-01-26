import React from "react"
import useInput from "../dom/hooks/useInput"
import FormField from "../ui/components/FormField"
import {
  bgMidnight,
  flex,
  flexCol,
  h,
  m,
  maxW,
  mb,
  mt,
  opacity,
  p,
  textCenter,
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
    <div css={[h("full"), flex, p(4)]}>
      <div className="raised-panel" css={m("auto")}>
        <div css={[bgMidnight(800), p(3), textCenter]}>
          <h1 className="font-condensed text-3xl">Login</h1>
        </div>

        <form css={[flex, flexCol, p(4)]} onSubmit={handleSubmit}>
          <fieldset
            disabled={disabled}
            css={[transition("opacity"), disabled && opacity(50)]}
          >
            <FormField labelText="Username" css={mb(3)}>
              <input
                className="input"
                name="username"
                placeholder="awesome username"
                required
                {...account.bind}
              />
            </FormField>

            <FormField labelText="Password" css={mb(3)}>
              <input
                className="input"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                {...password.bind}
              />
            </FormField>

            <button className="button-solid" type="submit">
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
