import "@testing-library/jest-dom/extend-expect"
import "fake-indexeddb/auto"
import { raise } from "./common/raise"

// make sure we don't do any actual API requests
window.fetch = () => raise("mock")
