import type { CharacterStore } from "../character/CharacterStore"
import CharacterSummary from "../character/CharacterSummary"
import ChatNavAction from "../chat/ChatNavAction"
import Button from "../dom/Button"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"

export default function ChatNav({
  characterStore,
  identity,
  onLogout,
}: {
  characterStore: CharacterStore
  identity: string
  onLogout: () => void
}) {
  return (
    <nav className={`flex h-full bg-midnight-2`}>
      <div className={`flex flex-col`}>
        {/* <Modal
          title="Channel Browser"
          renderContent={() => <ChannelBrowser />}
          renderTrigger={(t) => (
            <ChatNavActionButton
              icon={<Icon which={icons.list} />}
              name="Browse channels"
              {...t}
            />
          )}
        />

        <Modal
          title="Online Users"
          renderTrigger={(t) => (
            <ChatNavActionButton
              icon={<Icon which={icons.users} />}
              name="Online Users"
              {...t}
            />
          )}
          renderContent={() => (
            <div className="h-[calc(100vh-8rem)]">
              <OnlineUsers />
            </div>
          )}
        />

        <Modal
          title="Status update"
          renderContent={({ close }) => <StatusUpdateForm onSuccess={close} />}
          renderTrigger={(t) => (
            <ChatNavActionButton
              icon={<Icon which={icons.updateStatus} />}
              name="Update your status"
              {...t}
            />
          )}
        />

        <NotificationListLink />

        <a {...routes.logs().link}>
          <ChatNavAction
            icon={<LogsIcon />}
            name="Logs"
            active={route.name === "logs"}
          />
        </a>

        <Modal
          title="Settings"
          renderTrigger={(t) => (
            <ChatNavActionButton
              icon={<Icon which={icons.settings} />}
              name="Settings"
              {...t}
            />
          )}
          renderContent={() => (
            <div className="p-4">
              <SettingsScreen />
            </div>
          )}
        />

        <Modal
          title="About next"
          renderTrigger={(t) => (
            <ChatNavActionButton
              icon={<Icon which={icons.about} />}
              name="About next"
              {...t}
            />
          )}
          renderContent={() => (
            <div className="p-4">
              <AppInfo />
            </div>
          )}
        /> */}

        <div className={`flex-1`} />

        <Button onClick={onLogout}>
          <ChatNavAction icon={<Icon which={icons.logout} />} name="Log out" />
        </Button>
      </div>
      <div className={`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
        <div className={`p-2 mb-1 bg-midnight-0`}>
          <CharacterSummary store={characterStore} name={identity} />
        </div>
        <div className={`flex-1`}>{/* <RoomTabList /> */}</div>
      </div>
    </nav>
  )
}
