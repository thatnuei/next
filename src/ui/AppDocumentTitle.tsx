import React from "react"
import DocumentTitle from "react-document-title"

const suffix = "next"

const AppDocumentTitle: React.FC<{ title?: string }> = ({ title = "", children }) => (
  <DocumentTitle title={title ? `${title} - ${suffix}` : suffix}>{children}</DocumentTitle>
)
export default AppDocumentTitle
