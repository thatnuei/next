import { useCallback } from "react"
import { queryCache, QueryConfig, useQuery } from "react-query"
import { flistFetch, GetCharactersResponse } from "../flist"
import { storedUserSession } from "./session"

export function useCharacterListQuery(
	config?: QueryConfig<GetCharactersResponse>,
) {
	const query = useQuery(
		"characters",
		async () => {
			const session = await storedUserSession.get()
			if (!session) throw new Error("Unauthorized")

			const response = await flistFetch<GetCharactersResponse>(
				`/json/api/character-list.php`,
				session,
			)

			return {
				...response,
				characters: response.characters.slice().sort(),
			}
		},
		config,
	)

	const setData = useCallback((data: GetCharactersResponse) => {
		queryCache.setQueryData("characters", data)
	}, [])

	return { ...query, setData }
}
