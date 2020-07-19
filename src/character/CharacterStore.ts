import { MapWithDefault } from "../state/MapWithDefault"

type Friendship = {
  us: string
  them: string
}

export class CharacterStore {
  characters = new MapWithDefault(() => ({}))
  friends: Friendship[] = []
  bookmarks: string[] = []
  ignored: string[] = []
  admins: string[] = []
}
