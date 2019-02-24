import React, { ComponentPropsWithoutRef } from "react"

const ExternalLink = (props: ComponentPropsWithoutRef<"a">) => {
  return <a target="_blank" rel="noopener noreferrer" {...props} />
}
export default ExternalLink
