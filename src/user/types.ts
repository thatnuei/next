export interface FriendsAndBookmarksResponse {
	readonly friendlist: ReadonlyArray<{
		/** our character */
		source: string
		/** their character */
		dest: string
	}>
	readonly bookmarklist: readonly string[]
}
