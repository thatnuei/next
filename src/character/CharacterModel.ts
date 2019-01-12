import * as fchat from "fchat"

export default class CharacterModel {
  constructor(
    public readonly name: string,
    public readonly gender: fchat.Character.Gender,
    public readonly status: fchat.Character.Status,
    public readonly statusMessage = "",
  ) {}
}
