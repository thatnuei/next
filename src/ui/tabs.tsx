import React, {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  useState,
} from "react"
import createContextWrapper from "../common/createContextWrapper"

function createTabs<TabName extends string>(tabs: readonly TabName[]) {
  const [TabProvider, useTabContext] = createContextWrapper(() => {
    const [currentTab, setCurrentTab] = useState(tabs[0])
    return { currentTab, setCurrentTab }
  })

  function TabLink(props: ComponentPropsWithoutRef<"div"> & { tab: TabName }) {
    const context = useTabContext()

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      context.setCurrentTab(props.tab)
      if (props.onClick) props.onClick(event)
    }

    const activeClass = context.currentTab === props.tab && "active"
    const className = [activeClass, props.className].filter(Boolean).join(" ")

    // TODO: make accessible
    return <div {...props} onClick={handleClick} className={className} />
  }

  function TabContent(props: PropsWithChildren<{ tab: TabName }>) {
    const context = useTabContext()
    return <>{props.tab === context.currentTab ? props.children : null}</>
  }

  return {
    TabProvider,
    TabLink,
    TabContent,
  }
}

export default createTabs
