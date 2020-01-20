import React from "react"
import useInput from "../dom/hooks/useInput"
import FormField from "../ui/components/FormField"

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
    <div className="h-full flex p-4">
      <div className="raised-panel m-auto">
        <div className="bg-midnight-800 p-3 text-center">
          <h1 className="font-condensed text-3xl">Login</h1>
        </div>
        <form className="flex flex-col p-4" onSubmit={handleSubmit}>
          <fieldset
            disabled={disabled}
            className={`transition-normal ${disabled ? "opacity-50" : ""}`}
          >
            <FormField labelText="Username" className="mb-3">
              <input
                className="input"
                name="username"
                placeholder="awesome username"
                required
                {...account.bind}
              />
            </FormField>

            <FormField labelText="Password" className="mb-3">
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

          {error ? <p className="mt-4 max-w-xs text-center">{error}</p> : null}
        </form>
      </div>
    </div>
  )
}

export default Login
