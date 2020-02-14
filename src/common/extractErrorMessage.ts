export function extractErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
