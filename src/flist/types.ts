import type { NonEmptyArray } from "../common/types"

export type LoginCredentials = {
  account: string
  password: string
}

export type AuthUser = {
  account: string
  password: string // password is needed to refresh the auth token, but we should figure out a way to not store this here
  ticket: string
  characters: NonEmptyArray<string>
}
