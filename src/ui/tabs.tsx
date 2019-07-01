import React, {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  useState,
} from "react"
import createContextWrapper from "../common/createContextWrapper"

function createTabs<TabName extends string>(tabs: readonly TabName[]) {
  function useTabState() {
    const [currentTab, setCurrentTab] = useState(tabs[0])
    return { currentTab, setCurrentTab }
  }

  const [TabProvider, useTabContext] = createContextWrapper(useTabState)

  function TabList(props: ComponentPropsWithoutRef<"div">) {
    return <div {...props} role="tablist" />
  }

  function Tab(props: ComponentPropsWithoutRef<"div"> & { tab: TabName }) {
    const context = useTabContext()
    const isSelected = context.currentTab === props.tab

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      context.setCurrentTab(props.tab)
      if (props.onClick) props.onClick(event)
    }

    const activeClass = context.currentTab === props.tab && "active"
    const className = [activeClass, props.className].filter(Boolean).join(" ")

    return (
      <div
        {...props}
        onClick={handleClick}
        className={className}
        style={{ cursor: "pointer", ...props.style }}
        role="tab"
        aria-selected={isSelected}
        aria-controls={props.tab}
        tabIndex={0}
      />
    )
  }

  function TabPanel(props: PropsWithChildren<{ tab: TabName }>) {
    const context = useTabContext()
    return <>{props.tab === context.currentTab ? props.children : null}</>
  }

  return {
    TabProvider,
    TabList,
    Tab,
    TabPanel,
  }
}

export default createTabs
