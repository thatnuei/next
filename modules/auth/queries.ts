import { get } from "idb-keyval"
import { useCallback } from "react"
import { queryCache, QueryConfig, useQuery } from "react-query"
import { getCharacters, GetCharactersResponse } from "../flist"
import { UserSession } from "./session"

export function useCharacterListQuery(
	config?: QueryConfig<GetCharactersResponse>,
) {
	const query = useQuery(
		"characters",
		async () => {
			const session = await get<UserSession | null>("session")
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
