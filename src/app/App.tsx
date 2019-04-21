import { observer } from "mobx-react-lite"
import { useRootStore } from "../RootStore"

function App() {
  const { viewStore } = useRootStore()
  return viewStore.renderScreen()
}

export default observer(App)
