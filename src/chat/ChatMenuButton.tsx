import type { ReactNode } from ".pnpm/@types+react@17.0.14/node_modules/@types/react"
import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import Drawer from "../ui/Drawer"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"

export default function ChatMenuButton({ children }: { children: ReactNode }) {
  return (
    <Drawer
      side="left"
      renderTrigger={(props) => (
        <Button
          title="Show side menu"
          className={`${fadedButton} block md:hidden`}
          {...props}
        >
          <Icon which={icons.menu} />
        </Button>
      )}
    >
      {children}
    </Drawer>
  )
}
