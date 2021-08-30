import { createSimpleContext } from "../react/createSimpleContext"

export const {
  Provider: IdentityContextProvider,
  useValue: useIdentityContext,
  useOptionalValue: useOptionalIdentityContext,
} = createSimpleContext<string>("Identity")
