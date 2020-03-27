import { Channel, createChannel } from "../channel/types"
import { Character } from "../character/types"
import { Message } from "../message/types"
import { ChatState } from "./state"

export const testificate: Character = {
  name: "Testificate",
  gender: "Male",
  status: "busy",
  statusMessage: "look at this photograph every time i do it makes me laugh",
}

export const subaru: Character = {
  name: "Subaru-chan",
  gender: "Female",
  status: "online",
  statusMessage: "h",
}

export const users: Character[] = [
  {
    name: "Testificate",
    gender: "Male",
    status: "online",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Female",
    status: "looking",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Shemale",
    status: "busy",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Transgender",
    status: "away",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Cunt-boy",
    status: "dnd",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Male-Herm",
    status: "offline",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "None",
    status: "offline",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
]

export const messages = users.map<Message>((sender) => ({
  key: String(Math.random()),
  senderName: sender.name,
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non vehicula metus. Suspendisse sollicitudin lacus tortor, sed ornare ante pretium ut. In accumsan, purus sit amet hendrerit convallis, libero ex porta dolor, ac varius lacus nulla id lacus. In et gravida dui. Nulla nec quam erat. Aliquam nec arcu est. Sed at elit vulputate, convallis libero sit amet, ornare sem. Maecenas condimentum risus ipsum, a malesuada sem auctor sit amet. Pellentesque a vehicula lectus, sed posuere lacus. Quisque id nulla nec magna aliquam mollis. Quisque quis dolor erat.",
  timestamp: Date.now(),
  type: "normal",
}))

messages[0].type = "lfrp"
messages[1].type = "admin"
messages[2].type = "system"

export function createMockChannel(id: string, title = id): Channel {
  return {
    ...createChannel(id),
    title,
    messages,
    users: ["Subaru-chan", "Testificate"],
  }
}

export const chatState: ChatState = {
  characters: {
    "Subaru-chan": subaru,
    "Testificate": testificate,
  },
  channels: {
    "Frontpage": createMockChannel("Frontpage"),
    "Fantasy": createMockChannel("Fantasy"),
    "Story Driven LFRP": createMockChannel("Story Driven LFRP"),
    "aiolofasjdf;asdmfoidfa;miosd;afanio;": createMockChannel(
      "aiolofasjdf;asdmfoidfa;miosd;afanio;",
      "Kissaten Treehouse (Slice of Life)",
    ),
  },
  privateChats: {},
}
