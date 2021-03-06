import { useState } from "react"
import Button from "../dom/Button"
import TextInput from "../dom/TextInput"
import type { LoginCredentials } from "../flist/types"
import { preventDefault } from "../react/preventDefault"
import usePromiseState from "../state/usePromiseState"
import { input, solidButton } from "../ui/components"
import FormField from "../ui/FormField"

export default function Login(props: {
  onSubmit: (credentials: LoginCredentials) => Promise<unknown> | void
}) {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")

  const authenticateState = usePromiseState()

  const submit = () => {
    if (authenticateState.isLoading) return
    authenticateState.setPromise(props.onSubmit({ account, password }))
  }

  const canSubmit =
    account !== "" && password !== "" && !authenticateState.isLoading

  const isFormDisabled = authenticateState.isLoading

  return (
    <form
      className="flex flex-col items-start p-4 space-y-4"
      onSubmit={preventDefault(submit)}
    >
      <FormField labelText="Username">
        <TextInput
          className={input}
          type="text"
          placeholder="awesome username"
          autoComplete="username"
          value={account}
          onChangeText={setAccount}
          disabled={isFormDisabled}
        />
      </FormField>

      <FormField labelText="Password">
        <TextInput
          className={input}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChangeText={setPassword}
          disabled={isFormDisabled}
        />
      </FormField>

      <Button className={solidButton} type="submit" disabled={!canSubmit}>
        Log in
      </Button>

      {authenticateState.error && (
        <p className="max-w-xs">{authenticateState.error.message}</p>
      )}
    </form>
  )
}
