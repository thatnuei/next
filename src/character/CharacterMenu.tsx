import { observer } from "mobx-react-lite"
import Button from "../dom/Button"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { usePrivateChatActions } from "../privateChat/state"
import { routes } from "../router"
import { useSocketActions } from "../socket/SocketConnection"
import { ContextMenuCheckbox, ContextMenuItem } from "../ui/ContextMenu"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useUserActions } from "../user"
import CharacterMemoInput from "./CharacterMemoInput"
import CharacterSummary from "./CharacterSummary"
import { useCharacterRoles, useFriendships } from "./state"

export default observer(function CharacterMenu({ name }: { name: string }) {
  const { isBookmarked, isIgnored } = useCharacterRoles(name)
  const friendships = useFriendships()
  const { send } = useSocketActions()
  const { addBookmark, removeBookmark } = useUserActions()
  const privateChatActions = usePrivateChatActions(name)

  return (
    <>
      <div className={`p-2 space-y-3 bg-midnight-0`}>
        <CharacterSummary name={name} />

        {friendships
          .filter(({ them }) => them === name)
          .map((item, index) => (
            <div
              key={index}
              className={`flex flex-row items-center px-2 py-1 space-x-1 text-sm text-green-400 bg-green-500 bg-opacity-20`}
            >
              <Icon which={icons.heart} />
              <div>{item.us}</div>
            </div>
          ))}
      </div>

      <div className={`flex flex-col`}>
        <ContextMenuItem icon={<Icon which={icons.link} />}>
          <ExternalLink href={getProfileUrl(name)}>Profile</ExternalLink>
        </ContextMenuItem>

        <ContextMenuItem icon={<Icon which={icons.message} />}>
          <Button
            onClick={() => {
              routes.privateChat({ partnerName: name }).push()
              privateChatActions.open()
            }}
          >
            Message
          </Button>
        </ContextMenuItem>

        <ContextMenuCheckbox
          icon={
            <Icon
              which={isBookmarked ? icons.bookmark : icons.bookmarkHollow}
            />
          }
          checked={isBookmarked}
          onCheckedChange={(shouldBookmark) => {
            if (shouldBookmark) {
              addBookmark({ name }).catch(console.error) // show error toast
            } else {
              removeBookmark({ name }).catch(console.error) // show error toast
            }
          }}
        >
          <Button>{isBookmarked ? "Remove bookmark" : "Bookmark"}</Button>
        </ContextMenuCheckbox>

        <ContextMenuCheckbox
          icon={<Icon which={isIgnored ? icons.ignore : icons.ignoreHollow} />}
          checked={isIgnored}
          onCheckedChange={(shouldIgnore) => {
            send({
              type: "IGN",
              params: {
                action: shouldIgnore ? "add" : "delete",
                character: name,
              },
            })
          }}
        >
          <Button>{isIgnored ? "Unignore" : "Ignore"}</Button>
        </ContextMenuCheckbox>
      </div>

      <div className={`p-2 bg-midnight-0`}>
        <CharacterMemoInput name={name} />
      </div>
    </>
  )
})
