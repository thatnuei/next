import { MotionProps } from "framer-motion"

export const fadeAnimation: MotionProps = {
  variants: {
    fadeOut: { opacity: 0 },
    fadeIn: { opacity: 1 },
  },
  initial: "fadeOut",
  animate: "fadeIn",
  exit: "fadeOut",
}

export const slideAnimation: MotionProps = {
  variants: {
    slideOut: {
      y: 20,
      transition: { ease: "easeIn", duration: 0.3 },
    },
    slideIn: {
      y: 0,
      transition: { ease: "easeOut", duration: 0.3 },
    },
  },
  initial: "slideOut",
  animate: "slideIn",
  exit: "slideOut",
}
