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
  mb,
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

export default function Login(props: Props) {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const submitDisabled = account === "" && password === ""

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    authenticate({ account, password })
      .then((data) => props.onSuccess({ ...data, account }))
      .catch((error) => setError(extractErrorMessage(error)))
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
            />
          </FormField>

          <FormField css={mb(4)} labelText="Password">
            <input
              css={input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          <button css={solidButton} type="submit" disabled={submitDisabled}>
            Log in
          </button>

          <p>{error}</p>
        </form>
      </div>
    </main>
  )
}
