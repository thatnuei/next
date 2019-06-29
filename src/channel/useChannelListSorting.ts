import sortBy from "lodash/sortBy"
import { useState } from "react"
import { IconName } from "../ui/Icon"
import { ChannelListing } from "./ChannelStore"

export default function useChannelListSorting() {
  type SortMode = {
    icon: IconName
    sortEntries: (entries: ChannelListing[]) => ChannelListing[]
  }

  const sortModes: SortMode[] = [
    {
      icon: "sortNumeric",
      sortEntries: (entries) => sortBy(entries, "userCount").reverse(),
    },
    {
      icon: "sortAlphabetical",
      sortEntries: (entries) => sortBy(entries, "name"),
    },
  ]

  const [sortModeIndex, setSortModeIndex] = useState(0)

  const sortMode = sortModes[sortModeIndex]

  const cycleSortMode = () => {
    setSortModeIndex((index) => (index + 1) % sortModes.length)
  }

  return { sortMode, cycleSortMode }
}
