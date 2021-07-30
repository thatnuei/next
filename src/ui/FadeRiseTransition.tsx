import { createTransitionComponent } from "./createTransitionComponent"

const FadeRiseTransition = createTransitionComponent({
	enterFrom: `transform translate-y-4 opacity-0`,
	enterTo: `transform translate-y-0 opacity-100`,
})

export default FadeRiseTransition
