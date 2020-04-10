import createContextWrapper from "../react/createContextWrapper"
import { createFListApi } from "./api"

export const useApiContext = createContextWrapper(() => createFListApi())
export const ApiProvider = useApiContext.Provider
