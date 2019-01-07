import { mdiAccountMultiple, mdiMenu } from "@mdi/js"
import { RouteComponentProps } from "@reach/router"
import React, { useState } from "react"
import { Button } from "../ui/Button"
import { primaryColor } from "../ui/colors"
import { flexGrow, fullHeight } from "../ui/helpers"
import { Icon } from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"

type ChatRouteProps = RouteComponentProps

function ChatRoute(props: ChatRouteProps) {
  // const appState = useAppStateContext()

  // useEffect(() => {
  //   const disconnect = appState.connectToChat()
  //   return disconnect
  // }, [])

  const [sidebarVisible, setSidebarVisible] = useState(false)

  return (
    <main css={fullHeight}>
      <header css={headerStyle}>
        <Button flat onClick={() => setSidebarVisible(true)}>
          <Icon path={mdiMenu} />
        </Button>

        <h2 css={flexGrow}>Frontpage</h2>

        <Button flat>
          <Icon path={mdiAccountMultiple} />
        </Button>
      </header>

      <SideOverlay visible={sidebarVisible} onClick={() => setSidebarVisible(false)}>
        <div>sidebar content eventually</div>
      </SideOverlay>
    </main>
  )
}
export default ChatRoute

const headerStyle = css`
  display: flex;
  align-items: center;
  background-color: ${primaryColor};
  height: 50px;
`
