export type NavigationState = {
  route: Route
}

export type Route =
  | { type: "login" }
  | { type: "characterSelect" }
  | { type: "chat"; subRoute: ChatSubRoute }

export type ChatSubRoute =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }
  | { type: "console" }
