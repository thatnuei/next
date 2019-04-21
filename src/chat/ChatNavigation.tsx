import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import CharacterInfo from "../character/CharacterInfo"
import { useRootStore } from "../RootStore"
import Icon from "../ui/Icon"
import { ThemeColor } from "../ui/theme"

function ChatNavigation() {
  const { chatStore } = useRootStore()

  return (
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
          <CharacterInfo name={chatStore.identity} />
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
  )
}
export default observer(ChatNavigation)
