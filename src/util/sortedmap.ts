import { Comparator } from "./comparator";
import { Map } from "./map";

export interface SortedMap<K,V> extends Map<K,V> {
     comparator(): Comparator<K>;
     subMap(fromKey: K, toKey: K): SortedMap<K, V>;
     headMap(toKey: K): SortedMap<K, V>;
     tailMap(fromKey: K): SortedMap<K, V>;
     firstKey(): K;
     lastKey(): K;
}