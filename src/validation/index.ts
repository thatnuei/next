type ValidatorResult<T> = { type: "valid" } | { type: "invalid"; error: string }

type ValidateFn<T> = (value: unknown) => ValidatorResult<T>

type Validator<T = unknown> = {
  validate: ValidateFn<T>
  parse: (value: unknown) => T
  is: (value: unknown) => value is T
}

export type ValidatorType<V> = V extends Validator<infer T> ? T : never

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

export const optional = <T>(type: Validator<T>) =>
  union(type, literal(null), literal(undefined))

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
  createValidator<T[]>((value) => {
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

export const shape = <S extends Record<string, Validator>>(
  shape: S,
  { allowExtraKeys = false } = {},
) =>
  createValidator<{ [K in keyof S]: ValidatorType<S[K]> }>((maybeObject) => {
    if (typeof maybeObject !== "object" || maybeObject === null) {
      return {
        type: "invalid",
        error: `expected object, got ${stringify(maybeObject)}`,
      }
    }

    const errors: string[] = []

    for (const [shapeKey, validator] of Object.entries(shape)) {
      const value = (maybeObject as any)[shapeKey]
      const result = validator.validate(value)
      if (result.type === "invalid") {
        errors.push(`validation for key "${shapeKey}" failed: ${result.error}`)
      }
    }

    if (!allowExtraKeys) {
      for (const key of Object.keys(maybeObject)) {
        if (!(key in shape)) {
          errors.push(`extra key ${key}`)
        }
      }
    }

    if (errors.length > 0) {
      return {
        type: "invalid",
        error: `shape validation failed:\n${errors.join("\n")}`,
      }
    }

    return { type: "valid" }
  })

export const dictionary = <T>(valueType: Validator<T>) =>
  createValidator<Record<string, T | undefined>>((maybeObject) => {
    if (typeof maybeObject !== "object" || maybeObject === null) {
      return {
        type: "invalid",
        error: `expected object, got ${stringify(maybeObject)}`,
      }
    }

    for (const value of Object.values(maybeObject)) {
      if (value === undefined) continue

      const result = valueType.validate(value)
      if (result.type === "invalid") {
        return {
          type: "invalid",
          error: `dictionary validation failed: ${result.error}`,
        }
      }
    }

    return { type: "valid" }
  })
