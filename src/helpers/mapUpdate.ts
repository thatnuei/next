export function mapUpdate<K, V>(
	map: Map<K, V>,
	key: K,
	update: (value: V) => void,
) {
	if (map.has(key)) {
		update(map.get(key) as V)
	}
}
