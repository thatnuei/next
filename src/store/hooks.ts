import { useDispatch, useSelector } from "react-redux"
import { AppState } from "."

export function useAppSelector<V>(selector: (state: AppState) => V) {
  return useSelector(selector)
}

export function useAppDispatch() {
  // no need to strictly type it for now when we have typed action creators
  return useDispatch()
}
