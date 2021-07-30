import {
	atomWithStorage,
	selectAtom,
	useAtomValue,
	useUpdateAtom,
} from "jotai/utils"
import { useCallback, useMemo } from "react"

const nicknamesAtom = atomWithStorage<{ [characterName: string]: string }>(
	"characterNicknames",
	{},
)

export function useNickname(characterName: string): string | undefined {
	return useAtomValue(
		useMemo(() => {
			return selectAtom(nicknamesAtom, (nicknames) => nicknames[characterName])
		}, [characterName]),
	)
}

export function useSetNickname(characterName: string) {
	const setNicknames = useUpdateAtom(nicknamesAtom)
	return useCallback(
		(newNickname: string) => {
			setNicknames((nicks) => ({ ...nicks, [characterName]: newNickname }))
		},
		[characterName, setNicknames],
	)
}

export function useGetNickname() {
	const nicknames = useAtomValue(nicknamesAtom)
	return useCallback(
		(characterName: string) => nicknames[characterName],
		[nicknames],
	)
}
