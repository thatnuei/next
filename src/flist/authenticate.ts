import type { NonEmptyArray } from "../common/types"
import { fetchFlist } from "./fetchFlist"
import type { AuthUser, LoginCredentials } from "./types"

interface GetApiTicketResponse {
	characters: NonEmptyArray<string>
	ticket: string
}

export async function authenticate(args: LoginCredentials): Promise<AuthUser> {
	const response = await fetchFlist<GetApiTicketResponse>("/getApiTicket.php", {
		...args,
		no_friends: true,
		no_bookmarks: true,
	})
	return { ...response, account: args.account, password: args.password }
}
