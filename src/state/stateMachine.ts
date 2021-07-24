import { proxy, useSnapshot } from "valtio"
import { useInstanceValue } from "../react/useInstanceValue"

interface ObjectWithType {
	readonly type: string
}

type UnionMemberWithType<Union, Type> = Extract<Union, { readonly type: Type }>

interface StateMachineConfig<
	State extends ObjectWithType,
	Event extends ObjectWithType,
	Effect extends ObjectWithType,
> {
	initialState: State

	states: {
		[StateType in State["type"]]?: {
			onEnter?: (state: UnionMemberWithType<State, StateType>) => Effect[]
			on?: {
				[EventType in Event["type"]]?: {
					state?: (event: UnionMemberWithType<Event, EventType>) => State
					effects?: (event: UnionMemberWithType<Event, EventType>) => Effect[]
				}
			}
		}
	}

	effects?: {
		[ActionType in Effect["type"]]: (
			action: UnionMemberWithType<Effect, ActionType>,
		) => void
	}
}

export function createStateMachineInstance<
	State extends ObjectWithType,
	Event extends ObjectWithType,
	Effect extends ObjectWithType,
>(config: StateMachineConfig<State, Event, Effect>) {
	const instance = proxy({
		state: config.initialState,
		dispatch: (event: Event) => {
			const stateConfig = config.states?.[instance.state.type as State["type"]]
			if (!stateConfig) return

			const eventTransition = stateConfig?.on?.[event.type as Event["type"]]

			const transitionState =
				eventTransition?.state?.(event as never) ?? instance.state

			const transitionEffects = eventTransition?.effects?.(event as never) ?? []

			const enterEffects =
				config.states?.[transitionState.type as State["type"]]?.onEnter?.(
					transitionState as never,
				) ?? []

			instance.state = transitionState

			const effects = [...transitionEffects, ...enterEffects]
			for (const effect of effects ?? []) {
				config.effects?.[effect.type as Effect["type"]]?.(effect as never)
			}
		},
	})
	return instance
}

export function useStateMachine<
	State extends ObjectWithType,
	Event extends ObjectWithType,
	Effect extends ObjectWithType,
>(config: StateMachineConfig<State, Event, Effect>) {
	// this doesn't get recreated from config changes, but fix later
	const instance = useInstanceValue(() => createStateMachineInstance(config))
	const state = useSnapshot(instance.state)
	return [state, instance.dispatch] as const
}
