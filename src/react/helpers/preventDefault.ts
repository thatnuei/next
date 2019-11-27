export function preventDefault<E extends React.SyntheticEvent>(
  callback: (event: E) => void = () => {},
) {
  return (e: E) => {
    e.preventDefault()
    callback(e)
  }
}
