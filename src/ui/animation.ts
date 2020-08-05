import { MotionProps } from "framer-motion"

const fadeVariants = {
  fadeOut: { opacity: 0 },
  fadeIn: { opacity: 1 },
}

export const fadeAnimation: MotionProps = {
  variants: fadeVariants,
  initial: "fadeOut",
  animate: "fadeIn",
  exit: "fadeOut",
}

const slideVariants = {
  slideOut: {
    y: 20,
    transition: { ease: "easeIn", duration: 0.3 },
  },
  slideIn: {
    y: 0,
    transition: { ease: "easeOut", duration: 0.3 },
  },
}

export const slideAnimation: MotionProps = {
  variants: slideVariants,
  initial: "slideOut",
  animate: "slideIn",
  exit: "slideOut",
}

const fadeSlideVariants = {
  fadeSlideOut: {
    ...fadeVariants.fadeOut,
    ...slideVariants.slideOut,
  },
  fadeSlideIn: {
    ...fadeVariants.fadeIn,
    ...slideVariants.slideIn,
  },
}

export const fadeSlideAnimation: MotionProps = {
  variants: fadeSlideVariants,
  initial: "fadeSlideOut",
  animate: "fadeSlideIn",
  exit: "fadeSlideOut",
}
