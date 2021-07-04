import { observable } from "micro-observables"
import { compare } from "../common/compare"
import { authenticate } from "../flist/authenticate"
import { fetchFlist } from "../flist/fetchFlist"
import type { AuthUser, LoginCredentials } from "../flist/types"

export interface FriendsAndBookmarksResponse {
	bookmarklist: string[]
	friendlist: Friendship[]
}

interface Friendship {
	/** Your character */
	source: string
	/** Their character */
	dest: string
}

const ticketExpireTime = 1000 * 60 * 5

export class UserStore {
	readonly userData = observable<AuthUser>({
		account: "",
		password: "",
		ticket: "",
		characters: [""],
	})

	private lastTicketFetchTime = 0
	private password = ""

	login = async ({ account, password }: LoginCredentials) => {
		const { ticket, characters } = await authenticate({
			account,
			password,
		})

		this.userData.set({
			account,
			password,
			ticket,
			characters: characters.sort(compare((name) => name.toLowerCase())),
		})
		this.password = password
		this.lastTicketFetchTime = Date.now()
	}

	addBookmark = async (args: { name: string }) => {
		const creds = await this.getFreshAuthCredentials()
		await fetchFlist(`/api/bookmark-add.php`, { ...args, ...creds })
	}

	removeBookmark = async (args: { name: string }) => {
		const creds = await this.getFreshAuthCredentials()
		await fetchFlist(`/api/bookmark-remove.php`, { ...args, ...creds })
	}

	getFriendsAndBookmarks = async () => {
		const creds = await this.getFreshAuthCredentials()
		return fetchFlist<FriendsAndBookmarksResponse>(
			`/api/friend-bookmark-lists.php`,
			{ ...creds, bookmarklist: true, friendlist: true },
		)
	}

	getMemo = async (args: { name: string }) => {
		const creds = await this.getFreshAuthCredentials()

		const res = await fetchFlist<{ note: string | null }>(
			"/api/character-memo-get2.php",
			{ ...creds, target: args.name },
		)

		return res.note ?? ""
	}

	setMemo = async ({ name, ...params }: { name: string; note: string }) => {
		const creds = await this.getFreshAuthCredentials()

		await fetchFlist("/api/character-memo-save.php", {
			...creds,
			...params,
			target_name: name,
		})
	}

	private async getFreshAuthCredentials() {
		if (Date.now() - this.lastTicketFetchTime > ticketExpireTime) {
			const userData = this.userData.get()

			const { ticket } = await authenticate({
				account: userData.account,
				password: this.password,
			})

			this.userData.set({ ...userData, ticket })
		}

		const { account, ticket } = this.userData.get()
		return { account, ticket }
	}
}
