import { Box, Grommet, Heading, Text } from "grommet"
import { cover } from "polished"
import React from "react"
import Avatar from "./character/Avatar"
import CharacterInfo from "./character/CharacterInfo"
import CharacterName from "./character/CharacterName"
import Chatbox from "./chat/Chatbox"
import MessageListItem from "./message/MessageListItem"
import GlobalStyle from "./ui/globalStyle"
import Icon from "./ui/Icon"
import { darkTheme, ThemeColor } from "./ui/theme"

const Design = () => {
  return (
    <Grommet theme={darkTheme}>
      <GlobalStyle />

      <Box
        direction="row"
        gap="xsmall"
        style={cover()}
        background={ThemeColor.bgDivision}
      >
        <Box as="nav" direction="row">
          <Box pad="small">
            <Box flex gap="medium">
              <Icon style={{ opacity: 0.5 }} icon="channels" />
              <Icon style={{ opacity: 0.5 }} icon="updateStatus" />
              <Icon style={{ opacity: 0.5 }} icon="about" />
            </Box>
            <Icon icon="logout" style={{ opacity: 0.5 }} />
          </Box>

          <Box gap="xsmall" width="small" background={ThemeColor.bgDark}>
            <Box background={ThemeColor.bg} pad="small">
              <CharacterInfo name="Serena Gardener" />
            </Box>

            <Box flex>
              <Box
                pad={{ horizontal: "small", vertical: "xsmall" }}
                direction="row"
                gap="xsmall"
                align="center"
              >
                <Icon icon="console" size={0.9} />
                <span>Console</span>
              </Box>

              <Box
                pad={{ horizontal: "small", vertical: "xsmall" }}
                direction="row"
                gap="xsmall"
                align="center"
              >
                <Icon icon="channels" size={0.9} />
                <span>Frontpage</span>
              </Box>

              <Box
                background={ThemeColor.bg}
                pad={{ horizontal: "small", vertical: "xsmall" }}
                direction="row"
                gap="xsmall"
                align="center"
              >
                <Icon icon="channels" size={0.9} />
                <span>Story Driven LFRP</span>
              </Box>

              <Box
                pad={{ horizontal: "small", vertical: "xsmall" }}
                direction="row"
                gap="xsmall"
                align="center"
              >
                <Icon icon="channels" size={0.9} />
                <span>Private Channel with Annoyingly Long Name</span>
              </Box>

              <Box
                pad={{ horizontal: "small", vertical: "xsmall" }}
                direction="row"
                gap="xsmall"
                align="center"
              >
                <Avatar name="Subaru-chan" size={20} />
                <span>Subaru-chan</span>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* chat room view */}
        <Box as="main" flex gap="xsmall">
          {/* room content */}
          <Box direction="row" flex gap="xsmall">
            <Box flex>
              <Box background={ThemeColor.bg}>
                <Box pad="small" direction="row" align="center">
                  <Box direction="row" align="center" gap="xsmall" flex>
                    <Heading level="2" size="small">
                      Story Driven LFRP
                    </Heading>
                    <Icon icon="about" size={1} style={{ opacity: 0.5 }} />
                  </Box>
                  <Box direction="row" gap="small">
                    <Text size="normal" style={{ opacity: 0.5 }}>
                      Both
                    </Text>
                    <Text size="normal">Chat</Text>
                    <Text size="normal" style={{ opacity: 0.5 }}>
                      Ads
                    </Text>
                  </Box>
                </Box>
                <Box
                  pad="small"
                  height="small"
                  overflow={{ vertical: "scroll" }}
                  background={ThemeColor.bgShaded}
                >
                  <Text size="small" style={{ whiteSpace: "pre-line" }}>
                    Numquam dolore quae et sit perspiciatis saepe eaque.
                    Exercitationem reiciendis id unde eaque quidem dolorem
                    maiores sunt. Et sed autem qui minima aperiam accusantium
                    illum assumenda. Ab quibusdam quis harum. Sit distinctio
                    velit voluptatem iste autem autem quo sed. Voluptate quidem
                    et reprehenderit suscipit nisi eligendi.{"\n\n"}
                    Nemo rerum expedita dolore rerum. Voluptas in qui ea. Quas
                    ut voluptatum saepe tempore consequatur accusantium. Iste
                    qui tempora et cum. Voluptatem magni culpa ex veniam placeat
                    et similique.{"\n\n"}
                    Similique consequuntur suscipit dolor vitae quibusdam.
                    Voluptate rem ab soluta sit laudantium. Sit hic in ea
                    molestias est. Necessitatibus dignissimos exercitationem
                    autem beatae.{"\n\n"}
                    Magni ea in quia ea provident nemo. Commodi aut et quo neque
                    laudantium. Vero consequuntur est eligendi magnam quia iure
                    est. Vel maxime natus asperiores delectus est. Odit ut sed
                    dolores voluptas voluptatem odit. Veritatis culpa id
                    veritatis rerum quia.
                  </Text>
                </Box>
              </Box>

              <Box as="ul" flex background={ThemeColor.bgDark}>
                <MessageListItem
                  senderName="Subaru-chan"
                  text="this is a message"
                  type="chat"
                  time={Date.now()}
                />
                <MessageListItem
                  senderName="Subaru-chan"
                  text="this is an admin message"
                  type="admin"
                  time={Date.now()}
                />
                <MessageListItem
                  senderName="Subaru-chan"
                  text="this is an ad"
                  type="lfrp"
                  time={Date.now()}
                />
                <MessageListItem
                  text="announcement: you suck"
                  type="system"
                  time={Date.now()}
                />
                <MessageListItem
                  senderName="Subaru-chan"
                  text="Numquam dolore quae et sit perspiciatis saepe eaque. Exercitationem reiciendis id unde eaque quidem dolorem maiores sunt. Et sed autem qui minima aperiam accusantium illum assumenda. Ab quibusdam quis harum. Sit distinctio velit voluptatem iste autem autem quo sed. Voluptate quidem et reprehenderit suscipit nisi eligendi."
                  type="chat"
                  time={Date.now()}
                />
                <MessageListItem
                  senderName="Subaru-chan"
                  text="/me does design maybe"
                  type="chat"
                  time={Date.now()}
                />
              </Box>
            </Box>

            <Box width="small">
              <Box background={ThemeColor.bg} pad="xsmall">
                Characters: 420
              </Box>

              <Box
                pad="xsmall"
                gap="xxsmall"
                flex
                overflow={{ vertical: "scroll" }}
                background={ThemeColor.bgDark}
              >
                <CharacterName
                  name="Subaru-chan"
                  gender="Female"
                  status="online"
                />
                <CharacterName
                  name="Subaru-chan"
                  gender="Transgender"
                  status="online"
                />
                <CharacterName
                  name="Subaru-chan"
                  gender="None"
                  status="online"
                />
                <CharacterName
                  name="Subaru-chan"
                  gender="Cunt-boy"
                  status="online"
                />
                <CharacterName
                  name="Subaru-chan"
                  gender="Male"
                  status="online"
                />
                <CharacterName
                  name="Subaru-chan"
                  gender="Male-Herm"
                  status="online"
                />
                <CharacterName
                  name="Subaru-chan"
                  gender="Shemale"
                  status="online"
                />
                <CharacterName
                  name="Subaru-chan"
                  gender="Herm"
                  status="online"
                />
              </Box>
            </Box>
          </Box>

          {/* chatbox */}
          <Box background={ThemeColor.bg} pad="xsmall">
            <Chatbox onSubmit={console.log} />
          </Box>
        </Box>
      </Box>
    </Grommet>
  )
}

export default Design
