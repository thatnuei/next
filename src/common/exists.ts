const exists = <V>(value: V | undefined | null | void): value is V => value != null
export default exists
