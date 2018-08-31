import * as fchat from "fchat";

export class CharacterModel {
  constructor(
    public name: string,
    public gender: fchat.Character.Gender,
    public status: fchat.Character.Status,
    public statusMessage = "",
  ) {}
}
