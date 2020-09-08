import { useCallback } from "react"
import { queryCache, QueryConfig, useQuery } from "react-query"
import { getCharacters, GetCharactersResponse } from "../flist"
import { storedUserSession } from "./session"

export function useCharacterListQuery(
	config?: QueryConfig<GetCharactersResponse>,
) {
	const query = useQuery(
		"characters",
		async () => {
			const session = await storedUserSession.get()
			if (!session) throw new Error("Unauthorized")
			return getCharacters(session)
		},
		config,
	)

	const setData = useCallback((data: GetCharactersResponse) => {
		queryCache.setQueryData("characters", data)
	}, [])

	return { ...query, setData }
}
