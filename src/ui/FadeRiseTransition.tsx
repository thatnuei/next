import { createTransitionComponent } from "./createTransitionComponent"

const FadeRiseTransition = createTransitionComponent({
	enterFrom: `translate-y-8 opacity-0`,
	enterTo: `translate-y-0 opacity-100`,
})

export default FadeRiseTransition
