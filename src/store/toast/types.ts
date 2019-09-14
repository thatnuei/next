export type UiMessage = {
  key: string
  text: string
  level: UiMessageLevel
}

export type UiMessageLevel = "info" | "success" | "warning" | "error"
