export const reject = <T>(
  items: readonly T[],
  shouldReject: (item: T) => boolean,
) => items.filter((it) => !shouldReject(it))
