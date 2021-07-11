import { useEffect, useReducer } from "react"
import { useEffectRef } from "../react/useEffectRef"

interface ObjectWithType {
	readonly type: string
}

type UnionMemberWithType<Union, Type> = Extract<Union, { readonly type: Type }>

type StateMap<
	State extends ObjectWithType,
	Event extends ObjectWithType,
	Effect extends ObjectWithType,
> = {
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

interface StateMachineConfig<
	State extends ObjectWithType,
	Event extends ObjectWithType,
	Effect extends ObjectWithType,
> {
	initialState: State
	states: StateMap<State, Event, Effect>
	effects?: {
		[ActionType in Effect["type"]]: (
			action: UnionMemberWithType<Effect, ActionType>,
		) => void
	}
}

export function useStateMachine<
	State extends ObjectWithType,
	Event extends ObjectWithType,
	Effect extends ObjectWithType,
>(config: StateMachineConfig<State, Event, Effect>) {
	interface Machine {
		state: State
		effects?: Effect[]
	}

	function reducer(state: Machine, event: Event): Machine {
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

	const [state, dispatch] = useReducer(reducer, {
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
