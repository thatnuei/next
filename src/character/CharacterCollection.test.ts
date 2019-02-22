import CharacterCollection from "./CharacterCollection"
import CharacterStore from "./CharacterStore"

test("CharacterCollection - generic", async () => {
  const store = new CharacterStore()
  const collection = new CharacterCollection(store)

  expect(collection.names).toEqual([])

  collection.add("aoi")
  collection.add("alli")
  collection.add("athena")

  expect(collection.names).toEqual(["aoi", "alli", "athena"])
  expect(collection.has("aoi")).toBe(true)
  expect(collection.has("violet")).toBe(false)

  collection.set(["serena", "hinako"])

  expect(collection.names).toEqual(["serena", "hinako"])

  collection.remove("serena")

  expect(collection.names).toEqual(["hinako"])

  expect(collection.characters[0]).toHaveProperty("name", "hinako")
  expect(collection.characters[0]).toHaveProperty("gender", "None")

  store.characters.get("hinako").setGender("Female")

  expect(collection.characters[0]).toHaveProperty("gender", "Female")
})
