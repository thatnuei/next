export const chatServerUrl = `wss://chat.f-list.net/chat2`

// https://wiki.f-list.net/F-Chat_Error_Codes
export const errorCodes = {
  channelMessageCooldown: 5,
  statusUpdateCooldown: 5, // this is dumb but it is what it is
  couldNotLocateChannel: 26,
  alreadyInChannel: 28,
  canOnlyJoinChannelWithInvite: 44,
  bannedFromChannel: 48,
}

export const sidebarMenuBreakpoint = 950
