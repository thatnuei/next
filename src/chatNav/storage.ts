import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"

const storedRoomSchema = v.union(
  v.shape(
    {
      type: v.literal("channel" as const),
      id: v.string,
    },
    { allowExtraKeys: true },
  ),
  v.shape(
    {
      type: v.literal("privateChat" as const),
      partnerName: v.string,
    },
    { allowExtraKeys: true },
  ),
)

export type StoredRoom = v.ValidatorType<typeof storedRoomSchema>

const storedRoomListSchema = v.shape({
  characters: v.dictionary(
    v.shape({
      rooms: v.array(storedRoomSchema),
      currentKey: v.optional(v.string),
    }),
  ),
})

export type StoredRoomList = v.ValidatorType<typeof storedRoomListSchema>

// we could make the identity a part of the key string too,
// but we're storing the identity-based room data as a record
// so we can iterate over all of the stored rooms for each character for a
// given account, e.g. for a list of "recently joined" rooms
// that can also be done by looping over storage keys and string matching,
// but that's dumb
export const getStoredRooms = (account: string) =>
  createStoredValue(`rooms:${account}`, storedRoomListSchema)
