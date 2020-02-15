import React, { useState } from "react"
import { extractErrorMessage } from "../common/extractErrorMessage"
import { authenticate } from "../flist/authenticate"
import { headerText, input, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import {
  alignItems,
  fixedCover,
  flexCenter,
  flexColumn,
  maxW,
  mb,
  mt,
  p,
  textCenter,
  themeBgColor,
  themeShadow,
} from "../ui/style"

type Props = {
  onSuccess: (data: LoginSuccessData) => void
}

export type LoginSuccessData = {
  account: string
  ticket: string
  characters: string[]
}

type State =
  | { current: "idle" }
  | { current: "loading" }
  | { current: "error"; error: string }

export default function Login(props: Props) {
  const [state, setState] = useState<State>({ current: "idle" })
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")

  const isEmpty = account === "" && password === ""
  const isLoading = state.current === "loading"

  const submitDisabled = isEmpty || isLoading
  const formDisabled = isLoading

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (state.current === "loading") return
    setState({ current: "loading" })

    authenticate({ account, password })
      .then((data) => {
        setState({ current: "idle" })
        props.onSuccess({ ...data, account })
      })
      .catch((error) => {
        setState({ current: "error", error: extractErrorMessage(error) })
      })
  }

  return (
    <main css={[fixedCover, flexCenter]}>
      <div css={[themeShadow]}>
        <h1 css={[themeBgColor(1), p(2), headerText, textCenter]}>Login</h1>
        <form
          css={[flexColumn, alignItems("flex-start"), themeBgColor(0), p(4)]}
          onSubmit={handleSubmit}
        >
          <FormField css={mb(4)} labelText="Username">
            <input
              css={input}
              type="text"
              placeholder="awesome username"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              disabled={formDisabled}
            />
          </FormField>

          <FormField css={mb(4)} labelText="Password">
            <input
              css={input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={formDisabled}
            />
          </FormField>

          <button css={solidButton} type="submit" disabled={submitDisabled}>
            Log in
          </button>

          {state.current === "error" && (
            <p css={[mt(4), maxW(60), textCenter]}>{state.error}</p>
          )}
        </form>
      </div>
    </main>
  )
}
