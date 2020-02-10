import React, { useState } from "react"
import { authenticate } from "./authenticate"
import { extractErrorMessage } from "./extractErrorMessage"

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
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button type="submit" disabled={submitDisabled}>
        Log in
      </button>

      <p>{error}</p>
    </form>
  )
}
