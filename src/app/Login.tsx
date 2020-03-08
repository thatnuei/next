import React, { useState } from "react"
import { extractErrorMessage } from "../common/extractErrorMessage"
import Button from "../dom/Button"
import { authenticate } from "../flist/authenticate"
import {
  headerText,
  input,
  raisedPanel,
  raisedPanelHeader,
  solidButton,
} from "../ui/components"
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
    <div>
      <div>
        <header>
          <h1>Login</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <FormField labelText="Username">
            <input
              type="text"
              placeholder="awesome username"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              disabled={formDisabled}
            />
          </FormField>

          <FormField labelText="Password">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={formDisabled}
            />
          </FormField>

          <Button type="submit" disabled={submitDisabled}>
            Log in
          </Button>

          {state.current === "error" && <p>{state.error}</p>}
        </form>
      </div>
    </div>
  )
}
