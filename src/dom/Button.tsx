import React from "react"

/** Regular DOM button with a better default type */
function Button(props: React.ComponentPropsWithoutRef<"button">) {
  return <button type="button" {...props} />
}

export default Button
