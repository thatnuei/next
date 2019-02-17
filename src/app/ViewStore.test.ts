import ViewStore from "./ViewStore"

test("setScreen", () => {
  const store = new ViewStore()
  expect(store.screen.name).toBe("init")
  store.setScreen({ name: "channel", channel: "whatever" })
  expect(store.screen).toEqual({ name: "channel", channel: "whatever" })
})
