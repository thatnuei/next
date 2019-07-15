import React, { ComponentPropsWithoutRef } from "react"

type ExternalLinkProps = ComponentPropsWithoutRef<"a"> & {
  children: React.ReactNode
}

const ExternalLink = (props: ExternalLinkProps) => {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a target="_blank" rel="noopener noreferrer" {...props} />
}
export default ExternalLink
