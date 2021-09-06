import type { ReactNode } from "react"

export type WrapperFn = (wrapperProps: { children: ReactNode }) => ReactNode

export default function WrapperStack({
  wrappers,
  children,
}: {
  wrappers: WrapperFn[]
  children: ReactNode
}) {
  return (
    <>
      {wrappers.reduceRight(
        (children, wrapper) => wrapper({ children }),
        children,
      )}
    </>
  )
}
