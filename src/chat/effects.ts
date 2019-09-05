import { createStorageEffect } from "../storage/helpers"

export const identityStorage = createStorageEffect<string>(
  (account) => `identity:${account}`,
)
