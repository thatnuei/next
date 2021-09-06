import BBC from "../bbc/BBC"
import BBCChannelLink from "../bbc/BBCChannelLink"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import { statusColors } from "../character/colors"
import Timestamp from "../dom/Timestamp"
import Icon from "../ui/Icon"
import { about } from "../ui/icons"
import type { NotificationDetails } from "./types"

export default function NotificationCard({
  details,
  timestamp,
}: {
  details: NotificationDetails
  timestamp?: number
}) {
  switch (details.type) {
    case "info":
    case "error":
      return (
        <NotificationCardBase message={details.message} timestamp={timestamp} />
      )

    case "broadcast":
      return (
        <NotificationCardBase
          message={details.message}
          avatarName={details.actorName}
          timestamp={timestamp}
          header={
            details.actorName ? (
              <>
                Broadcast from{" "}
                <strong className="font-medium opacity-100">
                  <CharacterName name={details.actorName} statusDot="hidden" />
                </strong>
              </>
            ) : (
              "Broadcast"
            )
          }
        />
      )

    case "status":
      return (
        <NotificationCardBase avatarName={details.name} timestamp={timestamp}>
          <CharacterName name={details.name} statusDot="hidden" /> is now{" "}
          <span style={{ color: statusColors[details.status] }}>
            {details.status}
          </span>
          {details.message ? (
            <>
              : <BBC text={details.message} />
            </>
          ) : null}
        </NotificationCardBase>
      )

    case "invite":
      return (
        <NotificationCardBase avatarName={details.sender} timestamp={timestamp}>
          <CharacterName name={details.sender} statusDot="hidden" /> has invited
          you to{" "}
          <BBCChannelLink
            channelId={details.channelId}
            title={details.title}
            type={details.title === details.channelId ? "public" : "private"}
          />
        </NotificationCardBase>
      )

    default:
      return null
  }
}

function NotificationCardBase({
  avatarName,
  header,
  message,
  children,
  timestamp,
}: {
  avatarName?: string
  header?: React.ReactNode
  message?: string
  children?: React.ReactNode
  timestamp?: number
}) {
  return (
    <div className="flex w-full gap-3 p-3 ">
      {avatarName ? (
        <Avatar name={avatarName} size={8} />
      ) : (
        <Icon which={about} size={8} />
      )}
      <div className="self-center flex-1 ">
        <div className="flex flex-col gap-2">
          {header ? <h2 className="text-xs">{header}</h2> : null}
          <p className="flex-1 leading-snug">
            {message ? <BBC text={message} /> : null}
            {children}
          </p>
          {timestamp ? (
            <Timestamp className="float-right text-xs italic opacity-75">
              {timestamp}
            </Timestamp>
          ) : null}
        </div>
      </div>
    </div>
  )
}
