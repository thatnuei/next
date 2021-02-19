import * as fchat from "fchat"
import { ValueOf } from "../common/types"

type CommandUnionFromRecord<T> = ValueOf<
	{
		[K in keyof T]: T[K] extends undefined
			? { type: K; params?: undefined } // optional params here makes destructuring nicer
			: { type: K; params: T[K] }
	}
>

export type ClientCommandRecord = fchat.Connection.ClientCommands
export type ServerCommandRecord = fchat.Connection.ServerCommands

export type ClientCommand = CommandUnionFromRecord<ClientCommandRecord>
export type ServerCommand = CommandUnionFromRecord<ServerCommandRecord>

export function parseServerCommand(commandString: string) {
	const type = commandString.slice(0, 3)

	const params =
		commandString.length > 3
			? (JSON.parse(commandString.slice(4)) as object)
			: undefined

	return { type, params } as ServerCommand
}

export function createCommandString(command: ClientCommand): string {
	return command.params
		? `${command.type} ${JSON.stringify(command.params)}`
		: command.type
}

type CommandHandlerMap<This = void> = {
	[K in keyof ServerCommandRecord]?: (
		this: This,
		params: ServerCommandRecord[K],
	) => void
}

export function createBoundCommandHandler<This>(
	thisArg: This,
	handlers: CommandHandlerMap<This>,
) {
	return function handleCommand(command: ServerCommand) {
		const handler = handlers[command.type]
		handler?.call(thisArg, command.params as never) // lol
		return handler != null
	}
}