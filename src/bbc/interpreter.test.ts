import * as bbc from "./interpreter"

test("tokenizing open tags", () => {
  expect(bbc.tokenize(`[b]`)).toEqual([
    { type: "open-tag", text: "[b]", tag: "b", value: "" },
  ])
})

test("tokenizing close tags", () => {
  expect(bbc.tokenize(`[/b]`)).toEqual([
    { type: "close-tag", text: "[/b]", tag: "b" },
  ])
})

test("tokenizing text", () => {
  expect(bbc.tokenize("hello world")).toEqual([
    { type: "text", text: "hello world" },
  ])
})

test("tokenizing everything", () => {
  expect(bbc.tokenize("test [b]hello[/b] [i]world[/i] test")).toEqual([
    { type: "text", text: "test " },
    { type: "open-tag", tag: "b", text: "[b]", value: "" },
    { type: "text", text: "hello" },
    { type: "close-tag", tag: "b", text: "[/b]" },
    { type: "text", text: " " },
    { type: "open-tag", tag: "i", text: "[i]", value: "" },
    { type: "text", text: "world" },
    { type: "close-tag", tag: "i", text: "[/i]" },
    { type: "text", text: " test" },
  ])
})

test("open tag value", () => {
  const token = bbc.tokenize(`[url=my.website]google[/url]`)[0]
  expect(token?.type === "open-tag" && token.value).toBe("my.website")
})

test("text nodes", () => {
  expect(bbc.interpret(`hello world`)).toEqual([
    { type: "text", text: "hello world" },
  ])
})

test("tag nodes", () => {
  const input = `[b]hello[/b]`

  expect(bbc.interpret(input)).toEqual([
    {
      type: "tag",
      tag: "b",
      value: "",
      children: [{ type: "text", text: "hello" }],
    },
  ])
})

test("empty tag nodes", () => {
  const input = `[b][/b]`

  expect(bbc.interpret(input)).toEqual([
    {
      type: "tag",
      tag: "b",
      value: "",
      children: [],
    },
  ])
})

test("nested tag nodes", () => {
  const input = `[b]hello [i]world[/i] foobar[/b]`

  expect(bbc.interpret(input)).toEqual([
    {
      type: "tag",
      tag: "b",
      value: "",
      children: [
        { type: "text", text: "hello " },
        {
          type: "tag",
          tag: "i",
          value: "",
          children: [{ type: "text", text: "world" }],
        },
        { type: "text", text: " foobar" },
      ],
    },
  ])
})

test("unended tag nodes", () => {
  const input = `[b]hello [i]world`

  expect(bbc.interpret(input)).toEqual([
    {
      type: "tag",
      tag: "b",
      value: "",
      children: [
        { type: "text", text: "hello " },
        {
          type: "tag",
          tag: "i",
          value: "",
          children: [{ type: "text", text: "world" }],
        },
      ],
    },
  ])
})

test("no error on mixed tags", () => {
  const input = `[b]hello [i]world[/b] test[/i]`

  expect(bbc.interpret(input)).toEqual([
    {
      type: "tag",
      tag: "b",
      value: "",
      children: [
        { type: "text", text: "hello " },
        {
          type: "tag",
          tag: "i",
          value: "",
          children: [
            { type: "text", text: "world" },
            { type: "text", text: "[/b]" },
            { type: "text", text: " test" },
          ],
        },
      ],
    },
  ])
})
