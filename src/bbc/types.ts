export interface OpenTagToken {
	type: "open-tag"
	text: string
	tag: string
	value: string
}

export interface CloseTagToken {
	type: "close-tag"
	text: string
	tag: string
}

export type Token = OpenTagToken | CloseTagToken | TextToken

interface TextToken {
	type: "text"
	text: string
}

interface TextNode {
	type: "text"
	text: string
}

export interface TagNode {
	type: "tag"
	tag: string
	value: string
	children: Node[]
}

export type Node = TextNode | TagNode
