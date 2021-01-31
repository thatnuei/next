import { CloseTagToken, Node, OpenTagToken, TagNode, Token } from "./types"

const openTagExpression = /^\[([a-z]+?)(?:=([^\]]+))?\]/i
const closeTagExpression = /^\[\/([a-z]+?)\]/i

function matchAt(input: string, expression: RegExp, position: number) {
	return expression.exec(input.slice(position))
}

function captureOpenTag(
	bbcString: string,
	position: number,
): OpenTagToken | undefined {
	const openTagMatch = matchAt(bbcString, openTagExpression, position)
	if (openTagMatch) {
		const [text, tag, value = ""] = openTagMatch
		return { type: "open-tag", text, tag: tag.toLowerCase(), value }
	}
}

function captureCloseTag(
	bbcString: string,
	position: number,
): CloseTagToken | undefined {
	const closeTagMatch = matchAt(bbcString, closeTagExpression, position)
	if (closeTagMatch) {
		const [text, tag] = closeTagMatch
		return { type: "close-tag", text, tag: tag.toLowerCase() }
	}
}

export function tokenize(bbcString: string): Token[] {
	const tokens: Token[] = []
	let position = 0

	while (position < bbcString.length) {
		const openTagToken = captureOpenTag(bbcString, position)
		if (openTagToken) {
			tokens.push(openTagToken)
			position += openTagToken.text.length
			continue
		}

		const closeTagToken = captureCloseTag(bbcString, position)
		if (closeTagToken) {
			tokens.push(closeTagToken)
			position += closeTagToken.text.length
			continue
		}

		let lastToken = tokens[tokens.length - 1]
		if (lastToken === undefined || lastToken.type !== "text") {
			lastToken = {
				type: "text",
				text: "",
			}
			tokens.push(lastToken)
		}

		lastToken.text += bbcString[position]
		position += 1
	}

	return tokens
}

export function parse(tokens: Token[]): Node[] {
	let position = 0

	function walk(): Node {
		let token = tokens[position]

		if (token.type === "open-tag") {
			const node: TagNode = {
				type: "tag",
				tag: token.tag,
				value: token.value,
				children: [],
			}

			// skip the open tag token
			position += 1
			token = tokens[position]

			const isCorrespondingCloseTag = () =>
				token?.type === "close-tag" && token.tag === node.tag

			const isEndOfTokens = () => token === undefined

			while (!isCorrespondingCloseTag() && !isEndOfTokens()) {
				node.children.push(walk())
				token = tokens[position]
			}

			// skip the close tag, or if we're at the end,
			// increase position so we finish
			position += 1

			return node
		}

		// if we reach this point, the token in question is either a text node,
		// or somehow invalid, so we'll just treat it as a text node in any case
		position += 1

		return { type: "text", text: token.text }
	}

	const tree: Node[] = []

	while (position < tokens.length) {
		tree.push(walk())
	}

	return tree
}

export function createBbcTree(bbcText: string) {
	return parse(tokenize(bbcText))
}

/** Returns the entire node as tags, start and end tags included (think outerHTML) */
export function getNodeAsText(node: Node): string {
	if (node.type === "text") return node.text

	const startTagText = `[${node.tag}${node.value ? `=${node.value}` : ""}]`
	const endTagText = `[/${node.tag}]`
	const innerText = node.children.map(getNodeAsText).join("")
	return `${startTagText}${innerText}${endTagText}`
}

/** Returns just the children of the node as text, excluding the start and end tags (think innerHTML) */
export function getNodeChildrenAsText(node: Node): string {
	if (node.type === "text") return node.text
	return node.children.map(getNodeAsText).join("")
}
