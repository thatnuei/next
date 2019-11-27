import Reference from "../state/classes/Reference"
import { UserCredentials } from "./types"

export const createEmptyUserCredentialsReference = () =>
  Reference.of<UserCredentials>({
    account: "",
    ticket: "",
    characters: [],
  })
