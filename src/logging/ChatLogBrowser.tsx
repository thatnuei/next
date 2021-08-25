import clsx from "clsx"
import { atom, useAtom } from "jotai"
import { sortBy } from "lodash-es"
import { useDeferredValue, useMemo } from "react"
import MessageListItem from "../message/MessageListItem"
import usePromise from "../state/usePromise"
import { headerText, select } from "../ui/components"
import EmptyState from "../ui/EmptyState"
import FormField from "../ui/FormField"
import LoadingIcon from "../ui/LoadingIcon"
import { ScreenHeader } from "../ui/ScreenHeader"
import { useChatLogger } from "./context"

const selectedRoomIdAtom = atom<string>("")

export default function ChatLogBrowser() {
  const logger = useChatLogger()

  const { value: rooms = [] } = usePromise(
    useMemo(() => logger.getAllRooms(), [logger]),
  )

  const [selectedRoomId, setSelectedRoomId] = useAtom(selectedRoomIdAtom)

  const { value: messages = [], isLoading: loadingMessagesPromise } =
    usePromise(
      useMemo(() => {
        if (selectedRoomId) {
          return logger.getMessages(selectedRoomId, 400)
        }
        return []
      }, [logger, selectedRoomId]),
    )

  const deferredMessages = useDeferredValue(messages)

  const loadingMessages =
    loadingMessagesPromise || messages !== deferredMessages

  const scrollToBottom = (element: HTMLElement | null) => {
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }

  return (
    <div className="flex flex-col h-full gap-1 relative">
      <div className="bg-midnight-0">
        <ScreenHeader>
          <h1 className={headerText}>Logs</h1>
        </ScreenHeader>
      </div>
      <div className="bg-midnight-0 p-3">
        <FormField labelText="Room">
          <select
            className={select}
            value={selectedRoomId}
            onChange={(event) => setSelectedRoomId(event.target.value)}
          >
            <option value="" disabled>
              Select a room
            </option>
            {sortBy(rooms, (room) => room.name.toLowerCase()).map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <div className="bg-midnight-1 flex-1 min-h-0">
        {selectedRoomId == null ? (
          <EmptyState>Choose a room to view its logs</EmptyState>
        ) : !loadingMessages && deferredMessages.length === 0 ? (
          <EmptyState />
        ) : null}
        <ul
          className={clsx(
            "overflow-y-auto transform translate-z-0 h-full transition-opacity",
            loadingMessages && "opacity-50",
          )}
          ref={scrollToBottom}
        >
          {deferredMessages.map((message) => (
            <li key={message.key}>
              <MessageListItem message={message} />
            </li>
          ))}
        </ul>
      </div>
      <div
        className={clsx(
          "flex py-4 absolute pointer-events-none inset-0 bg-black/50 transition-opacity",
          loadingMessages ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="m-auto">
          <LoadingIcon />
        </div>
      </div>
    </div>
  )
}
