import React, { useState } from "react"
import { authenticate, LoginCredentials } from "./authenticate"
import { extractErrorMessage } from "./extractErrorMessage"
import Login from "./Login"

function App() {
  const [error, setError] = useState("")

  const handleLoginSubmit = (creds: LoginCredentials) => {
    authenticate(creds)
      .then(console.log)
      .catch((error) => setError(extractErrorMessage(error)))
  }

  return <Login error={error} onSubmit={handleLoginSubmit} />
}

export default App
