import { useCallback } from "react"
import { atom, useRecoilValue } from "recoil"

type FriendshipInfo = {
  us: string
  them: string
}

export const friendsAtom = atom<FriendshipInfo[]>({
  key: "friends",
  default: [],
})

export function useIsFriend() {
  const friends = useRecoilValue(friendsAtom)
  return useCallback((name: string) => friends.some((f) => f.them === name), [
    friends,
  ])
}
