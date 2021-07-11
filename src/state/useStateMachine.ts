import { useEffect, useReducer } from "react"
import { useEffectRef } from "../react/useEffectRef"

interface StateMachineEvent {
	type: string
}

interface StateMachineEffect {
	type: string
}

type EventWithType<Event extends StateMachineEvent, Type> = Extract<
	Event,
	{ type: Type }
>

type EffectWithType<Effect extends StateMachineEffect, Type> = Extract<
	Effect,
	{ type: Type }
>

type TransitionMap<
	State extends PropertyKey,
	Event extends StateMachineEvent,
	Effect extends StateMachineEffect,
> = {
	[_ in State]?: {
		[EventType in Event["type"]]?: {
			state: State
			effects?: (event: EventWithType<Event, EventType>) => Effect[]
		}
	}
}

interface StateMachineConfig<
	State extends PropertyKey,
	Event extends StateMachineEvent,
	Effect extends StateMachineEffect,
> {
	initialStatus: State
	transitions: TransitionMap<State, Event, Effect>
	effects?: {
		[ActionType in Effect["type"]]: (
			action: EffectWithType<Effect, ActionType>,
		) => void
	}
}

export function useStateMachine<
	State extends PropertyKey,
	Event extends StateMachineEvent,
	Effect extends StateMachineEffect,
>(config: StateMachineConfig<State, Event, Effect>) {
	interface Machine {
		state: State
		effects?: Effect[]
	}

	function reducer(state: Machine, event: Event): Machine {
		const transition =
			config.transitions?.[state.state]?.[event.type as Event["type"]]

		if (!transition) return state

		return {
			state: transition.state,
			effects: transition.effects?.(event as never) || [],
		}
	}

	const [state, dispatch] = useReducer(reducer, {
		state: config.initialStatus,
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
