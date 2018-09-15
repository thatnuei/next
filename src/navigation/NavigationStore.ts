import { action, observable } from "mobx"

export type NavigationScreen = {
  key: string
  render: (props: NavigationScreenProps) => React.ReactElement<any> // should be ReactNode, but pose requires ReactElement
}

export type NavigationScreenProps = {
  close(): void
}

class NavigationStore {
  @observable
  screens: NavigationScreen[] = []

  @action.bound
  push(screen: NavigationScreen) {
    this.screens.push(screen)
  }

  @action.bound
  pop() {
    this.screens.pop()
  }

  @action.bound
  replace(screen: NavigationScreen) {
    this.pop()
    this.push(screen)
  }

  @action.bound
  removeView(key: string) {
    this.screens = this.screens.filter((screen) => screen.key !== key)
  }
}

export const navigationStore = new NavigationStore()
