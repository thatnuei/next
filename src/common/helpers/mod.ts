/**
 * Like the % operator, but returns the correct result for negative numbers
 *
 * @example
 * // wrong, we want it to loop back to the beginning when going backwards
 * -1 % 6 === -1
 *
 * // 👌
 * mod(-1, 6) === 5
 */
export default function mod(num: number, radix: number) {
  return ((num % radix) + radix) % radix
}
