import { useCallback } from "react"
import { atom, useRecoilValue } from "recoil"

type FriendshipInfo = {
  us: string
  them: string
}

export const friendsAtom = atom<readonly FriendshipInfo[]>({
  key: "friends",
  default: [],
})

export const bookmarksAtom = atom<readonly string[]>({
  key: "bookmarks",
  default: [],
})

export const ignoredAtom = atom<readonly string[]>({
  key: "ignored",
  default: [],
})

export const adminsAtom = atom<readonly string[]>({
  key: "admins",
  default: [],
})

export const isFriend = (friends: readonly FriendshipInfo[]) => (
  name: string,
) => friends.some((f) => f.them === name)

export function useIsFriend() {
  const friends = useRecoilValue(friendsAtom)
  return useCallback(isFriend(friends), [friends])
}
