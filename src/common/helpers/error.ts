export default function error(messageOrError: unknown): never {
  throw typeof messageOrError === "string"
    ? new Error(messageOrError)
    : messageOrError
}
