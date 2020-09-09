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
export type ServerCommandRecord = fchat.Connection.ServerCommands

export type ClientCommand = CommandRecordToUnion<ClientCommandRecord>
export type ServerCommand = CommandRecordToUnion<ServerCommandRecord>

export function parseCommandString(string: string): ServerCommand {
	const type = string.slice(0, 3)
	const params = string.length === 3 ? undefined : JSON.parse(string.slice(4))
	return { type, params } as ServerCommand
}
