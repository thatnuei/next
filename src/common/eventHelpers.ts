export function onlyOnSelf<E extends React.SyntheticEvent>(
  callback: (event: E) => void = () => {},
) {
  return (e: E) => {
    if (e.target === e.currentTarget) {
      callback(e)
    }
  }
}

export function preventDefault<E extends React.SyntheticEvent>(
  callback: (event: E) => void = () => {},
) {
  return (e: E) => {
    e.preventDefault()
    callback(e)
  }
}
