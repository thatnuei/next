import { mdiEarth } from "@mdi/js"
import React from "react"
import { styled } from "../ui/styled"
import { ChatNavigationTab } from "./ChatNavigationTab"

export interface ChatNavigationProps {}

export class ChatNavigation extends React.Component<ChatNavigationProps> {
  render() {
    return (
      <>
        <SectionHeader>PMs</SectionHeader>
        <ChatNavigationTab text="Subaru-chan" avatar="Subaru-chan" />
        <ChatNavigationTab text="Athena Light" avatar="Athena Light" />
        <ChatNavigationTab text="Akiyama Ai" avatar="Akiyama Ai" />
        <ChatNavigationTab text="Alli Moon" avatar="Alli Moon" />

        <SectionHeader>Channels</SectionHeader>
        <ChatNavigationTab text="Fantasy" icon={mdiEarth} />
        <ChatNavigationTab text="Frontpage" icon={mdiEarth} active />
        <ChatNavigationTab text="Development" icon={mdiEarth} />
        <ChatNavigationTab text="Story Driven LFRP" icon={mdiEarth} />
      </>
    )
  }
}

const SectionHeader = styled.h2`
  font-size: 1.2rem;
  margin-top: 0.8rem;
  opacity: 0.5;
`
