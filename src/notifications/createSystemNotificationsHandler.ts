import { decodeHtml } from "../dom/decodeHtml"
import { getAvatarUrl } from "../flist/helpers"
import type { Route } from "../router"
import { routes } from "../router"
import { createCommandHandler } from "../socket/helpers"

export function createSystemNotificationsHandler(route: Route) {
  return createCommandHandler({
    PRI({ character, message }) {
      const isPrivateChatRoute =
        route.name === "privateChat" && route.params.partnerName === character

      if (isPrivateChatRoute && document.hasFocus()) return

      const note = new window.Notification(`New message from ${character}`, {
        body: decodeHtml(message),
        icon: getAvatarUrl(character),
      })

      note.onclick = () => {
        routes.privateChat({ partnerName: character }).push()
        window.focus()
      }
    },
  })
}
