type ValidatorResult<T> = { type: "valid" } | { type: "invalid"; error: string }

type ValidateFn<T> = (value: unknown) => ValidatorResult<T>

type Validator<T = unknown> = {
  validate: ValidateFn<T>
  parse: (value: unknown) => T
  is: (value: unknown) => value is T
}

type ValidatorType<V> = V extends Validator<infer T> ? T : never

type ValueOf<T> = T extends readonly (infer V)[] ? V : T[keyof T]

const raise = (error: string): never => {
  throw new Error(error)
}

const createValidator = <T>(validate: ValidateFn<T>): Validator<T> => ({
  validate,

  parse: (value) => {
    const result = validate(value)
    return result.type === "valid" ? (value as T) : raise(result.error)
  },

  is: (value): value is T => {
    const result = validate(value)
    return result.type === "valid"
  },
})

const stringify = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export const string = createValidator<string>((value) =>
  typeof value === "string"
    ? { type: "valid" }
    : { type: "invalid", error: `expected string, got "${stringify(value)}"` },
)

export const number = createValidator<number>((value) =>
  typeof value === "number"
    ? { type: "valid" }
    : { type: "invalid", error: `expected number, got "${stringify(value)}"` },
)

export const boolean = createValidator<boolean>((value) =>
  typeof value === "boolean"
    ? { type: "valid" }
    : { type: "invalid", error: `expected boolean, got "${stringify(value)}"` },
)

export const literal = <T>(expectedValue: T) =>
  createValidator<T>((value) =>
    value === expectedValue
      ? { type: "valid" }
      : {
          type: "invalid",
          error: `expected an exact value, got ${stringify(value)}`,
        },
  )

export const union = <T extends Validator[]>(...members: T) =>
  createValidator<ValidatorType<T[number]>>((value) => {
    const results = members.map((it) => it.validate(value))

    if (results.some((result) => result.type === "valid")) {
      return { type: "valid" }
    }

    const errorMessages = results
      .map((result, index) =>
        result.type === "invalid"
          ? `union validation failed for member #${index + 1}: ${result.error}`
          : "",
      )
      .filter(Boolean)

    return {
      type: "invalid",
      error: `${errorMessages.join("\n")}\n\n`,
    }
  })

export const array = <T>(itemType: Validator<T>) =>
  createValidator((value) => {
    if (!Array.isArray(value)) {
      return {
        type: "invalid",
        error: `expected array, got ${stringify(value)}`,
      }
    }

    for (const [index, item] of value.entries()) {
      const result = itemType.validate(item)
      if (result.type === "invalid") {
        return {
          type: "invalid",
          error: `array validation failed on index ${index}: ${result.error}`,
        }
      }
    }

    return { type: "valid" }
  })

export const shape = <S extends Record<string, Validator>>(shape: S) =>
  createValidator((maybeObject) => {
    if (typeof maybeObject !== "object" || maybeObject === null) {
      return {
        type: "invalid",
        error: `expected object, got ${stringify(maybeObject)}`,
      }
    }

    const errors: string[] = []

    for (const [key, value] of Object.entries(maybeObject)) {
      if (!(key in shape)) {
        errors.push(`unexpected key ${key}`)
        continue
      }

      const validator = shape[key]
      const result = validator.validate(value)
      if (result.type === "invalid") {
        errors.push(`validation for key "${key}" failed: ${result.error}`)
      }
    }

    for (const shapeKey of Object.keys(shape)) {
      if (!(shapeKey in maybeObject)) {
        errors.push(`missing key "${shapeKey}" from shape`)
      }
    }

    return errors.length > 0
      ? {
          type: "invalid",
          error: `object validation failed:\n${errors.join("\n")}`,
        }
      : { type: "valid" }
  })
