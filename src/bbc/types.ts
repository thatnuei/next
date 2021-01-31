export type OpenTagToken = {
	type: "open-tag"
	text: string
	tag: string
	value: string
}

export type CloseTagToken = {
	type: "close-tag"
	text: string
	tag: string
}

export type Token = OpenTagToken | CloseTagToken | TextToken

type TextToken = {
	type: "text"
	text: string
}

type TextNode = {
	type: "text"
	text: string
}

export type TagNode = {
	type: "tag"
	tag: string
	value: string
	children: Node[]
}

export type Node = TextNode | TagNode
