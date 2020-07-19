export class MapWithDefault<V, K = string> extends Map<K, V> {
  constructor(private readonly getDefault: (key: K) => V) {
    super()
  }

  get(key: K): V {
    if (!this.has(key)) {
      this.set(key, this.getDefault(key))
    }
    return super.get(key) as V
  }
}
