export function pick<Subject, Key extends keyof Subject>(
  subject: Subject,
  keys: Key[],
): Pick<Subject, Key> {
  const result = {} as Pick<Subject, Key>
  for (const key of keys) {
    result[key] = subject[key]
  }
  return result
}
