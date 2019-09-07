export type ApiResponse<D> = { error: string } | { error: "" } & D

export type LoginResponse = {
  ticket: string
  characters: string[]
  bookmarks: { name: string }[]

  // should consider clientsidedly converting this to a more intuitive structure later
  // e.g. { us: string, them: string }
  friends: {
    /** Our character */
    dest_name: string
    /** Their character */
    source_name: string
  }[]
}
