import React, { PropsWithChildren } from "react"
import { flexCenter } from "../helpers"
import { styled } from "../styled"
import { spacing } from "../theme"
import RaisedPanel from "./RaisedPanel"

type Props = PropsWithChildren<{}>

function FullscreenRaisedPanel(props: Props) {
  return (
    <PageContainer>
      <RaisedPanel>{props.children}</RaisedPanel>
    </PageContainer>
  )
}

export default FullscreenRaisedPanel

const PageContainer = styled.div`
  height: 100vh;
  padding: ${spacing.large};
  overflow-y: auto;
  ${flexCenter};
`
