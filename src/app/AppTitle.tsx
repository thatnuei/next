import { useEffect } from "react"
import { isTruthy } from "../common/isTruthy"
import type { Falsy } from "../common/types"
import { useOpenPrivateChats } from "../privateChat/state"
import { useIdentity } from "../user"

export default function AppTitle() {
	const identity = useIdentity()

	const privateChats = useOpenPrivateChats()
	const unreadChats = privateChats.filter((chat) => chat.isUnread).length

	const prefixParts = [identity, unreadChats > 0 && `(${unreadChats})`]
	const prefix = joinPresentStrings(prefixParts, " ")
	const title = joinPresentStrings([prefix, "next"], " | ")

	useEffect(() => {
		document.title = title
	})

	return null
}

function joinPresentStrings(
	strings: readonly (string | Falsy)[],
	separator: string,
) {
	return strings.filter(isTruthy).join(separator)
}
