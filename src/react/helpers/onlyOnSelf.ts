export function onlyOnSelf<E extends React.SyntheticEvent>(
  callback: (event: E) => void = () => {},
) {
  return (e: E) => {
    if (e.target === e.currentTarget) {
      callback(e)
    }
  }
}
