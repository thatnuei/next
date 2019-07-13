import React, { ComponentPropsWithoutRef } from "react"

const ExternalLink = (props: ComponentPropsWithoutRef<"a">) => {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a target="_blank" rel="noopener noreferrer" {...props} />
}
export default ExternalLink
