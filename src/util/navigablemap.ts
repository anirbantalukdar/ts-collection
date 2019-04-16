import { SortedMap } from "./sortedmap";
import { MapEntry } from "./map";
import { NavigableSet } from "./navigableset";

export interface NavigableMap<K, V> extends SortedMap<K, V> {
     lowerEntry(key: K): MapEntry<K, V>;
     lowerKey(key: K): K;

     floorEntry(key: K): MapEntry<K, V>;
     floorKey(key: K): K;

     ceilingEntry(key: K): MapEntry<K, V>;
     ceilingKey(key: K): K;

     higherEntry(key: K): MapEntry<K, V>;
     higherKey(key: K): K;

     firstEntry(): MapEntry<K,V>;
     lastEntry(): MapEntry<K, V>

     pollFirstEntry(): MapEntry<K, V>;
     pollLastEntry(): MapEntry<K, V>;

     descendingMap(): NavigableMap<K, V>;

     navigableKeySet(): NavigableSet<K>;
     descendingKeySet(): NavigableSet<K>;

     subMap(fromKey: K, fromInclusive: boolean, toKey: K, toInclusive: boolean): NavigableMap<K, V>;
     subMap(fromKey: K, toKey: K): NavigableMap<K, V>;

     headMap(toKey: K): NavigableMap<K, V>;
     headMap(toKey: K, toInclusive: boolean): NavigableMap<K, V>;
     
     tailMap(toKey: K): NavigableMap<K, V>;
     tailMap(fromKey: K, fromInclusive: boolean): NavigableMap<K, V>;
}