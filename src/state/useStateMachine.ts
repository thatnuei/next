import { useEffect, useReducer } from "react"
import { useEffectRef } from "../react/useEffectRef"

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

interface Machine<State extends ObjectWithType, Effect extends ObjectWithType> {
	state: State
	effects?: Effect[]
}

function createStateMachineReducer<
	State extends ObjectWithType,
	Event extends ObjectWithType,
	Effect extends ObjectWithType,
>(config: StateMachineConfig<State, Event, Effect>) {
	return function reducer(
		state: Machine<State, Effect>,
		event: Event,
	): Machine<State, Effect> {
		const stateConfig = config.states?.[state.state.type as State["type"]]
		if (!stateConfig) return state

		const eventTransition = stateConfig?.on?.[event.type as Event["type"]]

		const transitionState =
			eventTransition?.state?.(event as never) ?? state.state

		const transitionEffects = eventTransition?.effects?.(event as never) ?? []

		const enterEffects =
			config.states?.[transitionState.type as State["type"]]?.onEnter?.(
				transitionState as never,
			) ?? []

		return {
			state: transitionState,
			effects: [...enterEffects, ...transitionEffects],
		}
	}
}

export function useStateMachine<
	State extends ObjectWithType,
	Event extends ObjectWithType,
	Effect extends ObjectWithType,
>(config: StateMachineConfig<State, Event, Effect>) {
	const [state, dispatch] = useReducer(createStateMachineReducer(config), {
		state: config.initialState,
		effects: [],
	})

	const configRef = useEffectRef(config)
	useEffect(() => {
		const config = configRef.current
		for (const action of state.effects ?? []) {
			config.effects?.[action.type as Effect["type"]]?.(action as never)
		}
	}, [configRef, state.effects])

	return [state, dispatch] as const
}
