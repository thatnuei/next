type UserState = {
  account: string
  ticket: string
  characters: string[]
  login: {
    loading: boolean
    error?: string
  }
}

export const state: UserState = {
  account: "",
  ticket: "",
  characters: [],
  login: {
    loading: false,
  },
}
