import { createTransitionComponent } from "./createTransitionComponent"

const FadeTransition = createTransitionComponent({
  enterFrom: `opacity-0`,
  enterTo: `opacity-100`,
})

export default FadeTransition
