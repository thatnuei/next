import { useCallback } from "react"
import { queryCache, QueryConfig, useQuery } from "react-query"
import { flistFetch } from "../flist"
import { storedUserSession } from "./session"

type CharacterListData = {
	characters: string[]
}

export function useCharacterListQuery(config?: QueryConfig<CharacterListData>) {
	const query = useQuery(
		"characters",
		async () => {
			const session = await storedUserSession.get()
			if (!session) throw new Error("Unauthorized")

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
