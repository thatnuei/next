import React from "react"

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export class Heading extends React.Component<Props> {
  render() {
    const { level = 1, ...props } = this.props
    return React.createElement(`h${level}`, props)
  }
}
