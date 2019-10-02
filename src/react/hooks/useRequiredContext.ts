import { useContext } from "react"
import assert from "../../common/helpers/assert"

export function useRequiredContext<V>(
  context: React.Context<V | undefined | null>,
  errorMessage = "Context provider not found",
) {
  const contextValue = useContext(context)
  assert(contextValue, errorMessage)
  return contextValue
}
