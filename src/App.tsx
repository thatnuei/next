import React, { useState } from "react"
import { authenticate } from "./authenticate"
import { extractErrorMessage } from "./extractErrorMessage"

function App() {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    authenticate(account, password)
      .then(console.log)
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

      <button type="submit">Log in</button>

      <p>{error}</p>
    </form>
  )
}

export default App
