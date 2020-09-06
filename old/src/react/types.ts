import { Dispatch, SetStateAction } from "react"

export type UseStateReturn<T> = readonly [boolean, Dispatch<SetStateAction<T>>]
