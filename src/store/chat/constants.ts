export const chatServerUrl = `wss://chat.f-list.net/chat2`

// https://wiki.f-list.net/F-Chat_Error_Codes
export const errorCodes = {
  channelMessageCooldown: 5,
  statusUpdateCooldown: 5, // this is dumb but it is what it is
} as const
