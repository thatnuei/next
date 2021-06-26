import { fetchFlist } from "./fetchFlist"
import type { AuthUser, LoginCredentials } from "./types"

export async function authenticate(args: LoginCredentials) {
	const response = await fetchFlist<AuthUser>("/getApiTicket.php", {
		...args,
		no_friends: true,
		no_bookmarks: true,
	})

	return { ...response, account: args.account }
}
