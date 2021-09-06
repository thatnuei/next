import type { RefObject } from "react"
import { useEffect } from "react"
import { useEffectRef } from "../react/useEffectRef"

export function useDomEvent<EventName extends keyof HTMLElementEventMap>(
  element: HTMLElement | RefObject<HTMLElement> | undefined | null,
  event: EventName,
  handler: (event: HTMLElementEventMap[EventName]) => void,
  options?: AddEventListenerOptions,
): void

export function useDomEvent<EventName extends keyof ElementEventMap>(
  element: Element | RefObject<Element> | undefined | null,
  event: EventName,
  handler: (event: ElementEventMap[EventName]) => void,
  options?: AddEventListenerOptions,
): void

export function useDomEvent<EventName extends keyof WindowEventMap>(
  element: Window,
  event: EventName,
  handler: (event: WindowEventMap[EventName]) => void,
  options?: AddEventListenerOptions,
): void

export function useDomEvent(
  target: EventTarget | RefObject<EventTarget> | undefined | null,
  event: string,
  handler: (event: Event) => void,
  { capture, once, passive, signal }: AddEventListenerOptions = {},
): void {
  const handlerRef = useEffectRef(handler)

  useEffect(() => {
    const el = target instanceof EventTarget ? target : target?.current
    if (el == null) return

    const listener = (event: Event) => {
      handlerRef.current(event)
    }

    el.addEventListener(event, listener, {
      capture,
      once,
      passive,
      signal,
    })

    return () => el.removeEventListener(event, listener)
  }, [capture, event, handlerRef, once, passive, signal, target])
}
