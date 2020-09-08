import * as fchat from "fchat"
import { ValueOf } from "../helpers/types"

type CommandRecordToUnion<T> = ValueOf<
	{
		[K in keyof T]: T[K] extends undefined
			? { type: K; params?: undefined }
			: { type: K; params: T[K] }
	}
>

type ClientCommandRecord = fchat.Connection.ClientCommands
type ServerCommandRecord = fchat.Connection.ServerCommands

export type ClientCommand = CommandRecordToUnion<ClientCommandRecord>
export type ServerCommand = CommandRecordToUnion<ServerCommandRecord>

export function parseCommandString(commandString: string): ServerCommand {
	if (commandString.length === 3) {
		return { type: commandString } as ServerCommand
	} else {
		return {
			type: commandString,
			params: JSON.parse(commandString.slice(4)),
		} as ServerCommand
	}
}
