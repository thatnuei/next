import * as fchat from "fchat"

export class CharacterModel {
  constructor(
    private name: string,
    private gender: fchat.Character.Gender,
    private status: fchat.Character.Status,
    private statusMessage = "",
  ) {}
}
