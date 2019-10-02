import { useContext } from "react"

export function useRequiredContext<V>(
  context: React.Context<V | undefined | null>,
  errorMessage = "Context provider not found",
) {
  const contextValue = useContext(context)
  if (contextValue == null) {
    throw new Error(errorMessage)
  }
  return contextValue
}
