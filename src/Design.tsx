import { Box, Grommet } from "grommet"
import { cover } from "polished"
import React from "react"
import Avatar from "./character/Avatar"
import CharacterInfo from "./character/CharacterInfo"
import CharacterName from "./character/CharacterName"
import GlobalStyle from "./ui/globalStyle"
import Icon from "./ui/Icon"
import { darkTheme, ThemeColor } from "./ui/theme"

const Design = () => {
  return (
    <Grommet theme={darkTheme}>
      <GlobalStyle />

      <Box direction="row" gap="xsmall" style={cover()}>
        <Box as="nav" direction="row">
          <Box pad="small">
            <Box flex gap="medium">
              <Icon icon="channels" />
              <Icon icon="updateStatus" />
              <Icon icon="about" />
            </Box>
            <Icon icon="logout" />
          </Box>
          <Box gap="xsmall" width="small">
            <Box background={ThemeColor.bg} pad="small">
              <CharacterInfo name="Yuko Hirayama" />
            </Box>
            <Box flex>
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
                <span>Subaru Chan</span>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* chat room view */}
        <Box as="main" flex>
          {/* room content */}
          <Box direction="row" flex gap="xsmall">
            <Box flex>
              <Box background={ThemeColor.bg} pad="small">
                room description / info
              </Box>
              <Box pad="small" flex>
                messages
              </Box>
            </Box>

            <Box width="small">
              <Box background={ThemeColor.bg} pad="xsmall">
                Characters: 420
              </Box>
              <Box
                pad="xsmall"
                gap="xsmall"
                flex
                overflow={{ vertical: "scroll" }}
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
          <Box pad="small" background={ThemeColor.bg}>
            chatbox
          </Box>
        </Box>
      </Box>
    </Grommet>
  )
}

export default Design
