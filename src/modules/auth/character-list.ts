import { useCallback } from "react"
import { queryCache, QueryConfig, useQuery } from "react-query"
import { flistFetch } from "../flist"
import { storedUserSession, UserSession } from "../user"

type CharacterListData = {
	characters: string[]
}

export function useCharacterListQuery(
	session: UserSession | undefined,
	config?: QueryConfig<CharacterListData>,
) {
	const query = useQuery(
		[session && "characters", session],
		async () => {
			const session = await storedUserSession.get()
			if (!session) throw new Error("Login required")

			return flistFetch<CharacterListData>(
				`/json/api/character-list.php`,
				session,
			)
		},
		config,
	)

	const setData = useCallback((data: CharacterListData) => {
		queryCache.setQueryData("characters", data)
	}, [])

	return { ...query, setData }
}
