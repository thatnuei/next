import fuzzysearch from "fuzzysearch"
import React from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import queryify from "../common/queryify"
import ChannelBrowserEntry from "./ChannelBrowserEntry"
import { ChannelListing } from "./ChannelStore"
import { ChannelBrowserSortMode } from "./types"

type Props = {
  entries: ChannelListing[]
  listHeight: number
  searchValue: string
  sortMode: ChannelBrowserSortMode
}

export default function ChannelBrowserEntryList(props: Props) {
  const searchQuery = queryify(props.searchValue)
  const entries = props.sortMode.sortEntries(props.entries).filter((entry) => {
    return fuzzysearch(searchQuery, queryify(entry.name))
  })

  const renderEntry = (props: ListChildComponentProps) => (
    <ChannelBrowserEntry {...props} entry={entries[props.index]} />
  )

  return (
    <FixedSizeList
      width="100%"
      height={props.listHeight}
      itemCount={entries.length}
      itemSize={36}
      itemKey={(index) => entries[index].id}
      children={renderEntry}
      overscanCount={10}
    />
  )
}
