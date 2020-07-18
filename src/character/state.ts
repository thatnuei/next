import { useCallback } from "react"
import { atom, atomFamily, selectorFamily, useRecoilValue } from "recoil"
import { useChatCredentials } from "../chat/credentialsContext"
import { CharacterGender, CharacterStatus } from "./types"

export type CharacterState = {
  name: string
  gender: CharacterGender
  status: CharacterStatus
  statusMessage: string
}

export const characterAtom = atomFamily<CharacterState, string>({
  key: "character",
  default: (name) => ({
    name,
    gender: "None",
    status: "offline",
    statusMessage: "",
  }),
})

const characterListSelector = selectorFamily({
  key: "characterList",
  get: (names: readonly string[]) => ({ get }) =>
    names.map((name) => get(characterAtom(name))),
})

export function useCharacter(name: string) {
  return useRecoilValue(characterAtom(name))
}

export function useIdentityCharacter() {
  const { identity } = useChatCredentials()
  return useCharacter(identity)
}

export function useCharacterList(names: readonly string[]) {
  return useRecoilValue(characterListSelector(names))
}

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
