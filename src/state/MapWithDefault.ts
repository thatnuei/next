export class MapWithDefault<V, K = string> {
  private readonly items = new Map<K, V>()

  constructor(private readonly getDefault: (key: K) => V) {}

  get(key: K): V {
    if (!this.items.has(key)) {
      this.items.set(key, this.getDefault(key))
    }
    return this.items.get(key) as V
  }
}
