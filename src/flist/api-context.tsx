import createContextWrapper from "../helpers/react/createContextWrapper"
import { createFListApi } from "./api.old"

export const useApiContext = createContextWrapper(() => createFListApi())
export const ApiProvider = useApiContext.Provider
