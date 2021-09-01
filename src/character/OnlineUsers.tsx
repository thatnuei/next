import clsx from "clsx"
import { sortBy, uniq } from "lodash-es"
import { matchSorter } from "match-sorter"
import type { ReactNode } from "react"
import { useDeferredValue, useMemo } from "react"
import { useChatContext } from "../chat/ChatContext"
import TextInput from "../dom/TextInput"
import { createStore, useStoreValue } from "../state/store"
import { input } from "../ui/components"
import Icon from "../ui/Icon"
import { bookmark, heart } from "../ui/icons"
import VirtualizedList from "../ui/VirtualizedList"
import CharacterName from "./CharacterName"
import type { Character } from "./types"
import { useCharacterList } from "./useCharacterList"

type ListItem = {
  type: "friend" | "bookmark" | "searched"
  character: Character
  containerClassName?: string
  icon?: ReactNode
}

const searchStore = createStore("")

export default function OnlineUsers() {
  const store = useChatContext().characterStore

  const friends = useCharacterList(
    useStoreValue(
      store.friendships.select((friendships) =>
        uniq(friendships.map((f) => f.them)),
      ),
    ),
  )

  const bookmarks = useCharacterList(
    useStoreValue(
      store.bookmarks.select((bookmarks) => Object.keys(bookmarks)),
    ),
  )

  const search = useStoreValue(searchStore)

  const searchedCharacters = useStoreValue(
    store.characters.select((characters) => {
      if (!search.trim()) return []
      return matchSorter(Object.values(characters), search, {
        keys: ["name", "gender", "status"],
      })
    }),
  )

  const sortByName = (characters: readonly Character[]) =>
    sortBy(characters, (character) => character.name.toLowerCase())

  const listItems = useDeferredValue(
    useMemo((): ListItem[] => {
      const getFriendItems = (): ListItem[] =>
        sortByName(friends).map((character) => ({
          character,
          type: "friend",
          containerClassName: "bg-green-400/10",
          icon: (
            <span className="text-green-300 opacity-50">
              <Icon which={heart} />
            </span>
          ),
        }))

      const getBookmarkItems = (): ListItem[] =>
        sortByName(bookmarks).map((character) => ({
          character,
          type: "bookmark",
          containerClassName: "bg-blue-400/10",
          icon: (
            <span className="text-blue-300 opacity-50">
              <Icon which={bookmark} />
            </span>
          ),
        }))

      const items = searchedCharacters.length
        ? searchedCharacters.map(
            (character): ListItem => ({
              type: "searched",
              character,
            }),
          )
        : [...getFriendItems(), ...getBookmarkItems()]

      return items.filter((item) => item.character.status !== "offline")
    }, [bookmarks, friends, searchedCharacters]),
  )

  return (
    <div className="flex flex-col h-full bg-midnight-2">
      <section className="flex-1 min-h-0">
        <VirtualizedList
          items={listItems}
          itemSize={40}
          getItemKey={(item) => `${item.character.name}-${item.type}`}
          renderItem={({ item, style }) => (
            <div
              style={style}
              className={clsx(
                "flex items-center px-2 justify-between",
                item.containerClassName,
              )}
            >
              <CharacterName name={item.character.name} />
              {item.icon}
            </div>
          )}
        />
      </section>

      <p className="p-2 text-sm italic text-center opacity-50">
        {listItems.length || "No"} result(s)
      </p>

      <section className="flex flex-row p-2 space-x-2 bg-midnight-0">
        <TextInput
          type="text"
          aria-label="Search"
          placeholder="Enter a character name, or try 'looking' or 'female'"
          className={clsx(input, `flex-1`)}
          value={search}
          onChangeText={searchStore.set}
        />
      </section>
    </div>
  )
}
