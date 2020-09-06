import { render } from "@testing-library/react"
import React from "react"
import TestProviders from "./TestProviders"

export function renderWithProviders(children: React.ReactNode) {
  return render(<TestProviders>{children}</TestProviders>)
}
