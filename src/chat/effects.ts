import { createStorageEffect } from "../storage/helpers"

export const storedIdentity = createStorageEffect<string>(
  (account) => `identity:${account}`,
)
