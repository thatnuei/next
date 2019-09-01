import * as fchat from "fchat"
import { IconName } from "../ui/Icon"
import { ChannelListing } from "./ChannelStore"

export type ChannelMode = fchat.Channel.Mode

export type ChannelBrowserSortMode = {
  icon: IconName
  sortEntries: (entries: ChannelListing[]) => ChannelListing[]
}
