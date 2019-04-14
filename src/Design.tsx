import { Box, Grid, Grommet } from "grommet"
import { cover } from "polished"
import React from "react"
import CharacterInfo from "./character/CharacterInfo"
import GlobalStyle from "./ui/globalStyle"
import { darkTheme, ThemeColor } from "./ui/theme"

const Design = () => {
  return (
    <Grommet theme={darkTheme}>
      <GlobalStyle />

      <Grid
        style={cover()}
        gap="xsmall"
        columns={["auto", "1fr", "auto"]}
        rows="1/1"
      >
        <Box direction="row">
          <Box pad="small" gap="small">
            actions
          </Box>
          <Box gap="xsmall" width="small">
            <Box background={ThemeColor.bg} pad="small">
              <CharacterInfo name="Yuko Hirayama" />
            </Box>
            <Box pad="small" flex>
              room navigation
            </Box>
          </Box>
        </Box>

        <Box>
          <Box background={ThemeColor.bg} pad="small">
            room description / info
          </Box>
          <Box pad="small" flex>
            messages
          </Box>
          <Box background={ThemeColor.bg} pad="small">
            chatbox
          </Box>
        </Box>

        <Box background={ThemeColor.bg} pad="small" gap="small">
          user list
        </Box>
      </Grid>
    </Grommet>
  )
}

export default Design
