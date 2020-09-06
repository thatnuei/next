/* eslint-disable */
/**
 * Automatically binds the `this` of the functions in an object to that object,
 * which allows using class methods in a pointfree manner
 */
export function autobind(instance: any) {
  const names = Object.getOwnPropertyNames(instance.__proto__)
  for (const memberName of names) {
    // skip getters/setters
    const descriptor = Object.getOwnPropertyDescriptor(
      instance.__proto__,
      memberName,
    )
    if (descriptor?.get || descriptor?.set) {
      continue
    }

    if (
      typeof instance[memberName] === "function" &&
      memberName !== "constructor"
    ) {
      instance[memberName] = instance[memberName].bind(instance)
    }
  }
}
