import { atom, useAtom } from "jotai"
import { useAtomValue } from "jotai/utils"
import { raise } from "../common/raise"

const identityAtom = atom<string | undefined>(undefined)

export function useOptionalIdentity() {
	return useAtomValue(identityAtom)
}

export function useIdentity() {
	return useAtomValue(identityAtom) ?? raise("identity not set")
}

export function useIdentityState() {
	return useAtom(identityAtom)
}
