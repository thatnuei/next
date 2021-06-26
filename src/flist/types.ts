export interface LoginCredentials {
	account: string
	password: string
}

export interface AuthUser {
	account: string
	password: string // password is needed to refresh the auth token, but we should figure out a way to not store this here
	ticket: string
	characters: string[]
}
