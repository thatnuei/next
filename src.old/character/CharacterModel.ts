import * as fchat from "fchat"

export class CharacterModel {
  constructor(
    public readonly name: string,
    public readonly gender: fchat.Character.Gender,
    public readonly status: fchat.Character.Status,
    public readonly statusMessage = "",
  ) {}
}
