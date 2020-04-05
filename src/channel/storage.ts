import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"

export type SerializedChannels = v.ValidatorType<
  typeof serializedChannelsSchema
>

const serializedChannelsSchema = v.shape({
  channelsByIdentity: v.dictionary(
    v.array(
      v.shape({
        id: v.string,
        title: v.string,
      }),
    ),
  ),
})

export const getStoredChannels = (account: string) =>
  createStoredValue(`channels:${account}`, serializedChannelsSchema)
