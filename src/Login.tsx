import React, { useState } from "react"
import { LoginCredentials } from "./authenticate"

type Props = {
  error: string
  onSubmit: (creds: LoginCredentials) => void
}

export default function Login(props: Props) {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")

  const submitDisabled = account === "" && password === ""

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    props.onSubmit({ account, password })
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

      <p>{props.error}</p>
    </form>
  )
}
