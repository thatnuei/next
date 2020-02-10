import "@testing-library/jest-dom/extend-expect"

// make sure we don't do any actual API requests
window.fetch = () => {
  throw new Error("mock")
}
