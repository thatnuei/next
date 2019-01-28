import React from "react"
import DocumentTitle from "react-document-title"

const suffix = "next"

type Props = {
  title?: string
  children?: React.ReactNode
}

const AppDocumentTitle = ({ title = "", children }: Props) => (
  <DocumentTitle title={title ? `${title} - ${suffix}` : suffix}>
    {children}
  </DocumentTitle>
)
export default AppDocumentTitle
