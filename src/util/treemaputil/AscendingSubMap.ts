import { NavigableSubMap } from "../treemaputil/NavigableSubMap";
import { TreeMap } from "../treemap";
import { Comparator } from "../comparator";
import { NavigableMap } from "../navigablemap";
import { IllegalArgumentException } from "../../lang/illegalargumentexception";
import { Iterator } from "../iterator";
import { Set } from "../set";
import { TreeMapEntry } from "../treemaputil/TreeMapEntry";

export class AscendingSubMap<K, V> extends NavigableSubMap<K, V> {
	public constructor(map: TreeMap<K, V>, fromStart: boolean, lo: K, loInclusive: boolean,
		toEnd: boolean, hi: K, hiInclusive: boolean) {
		super(map, fromStart, lo, loInclusive, toEnd, hi, hiInclusive);
	}

	public comparator(): Comparator<K> {
		return this.map.comparator();
	}

	public subMap(fromKey: K, toKey: K): NavigableMap<K, V>;
	public subMap(fromKey: K, fromInclusive: boolean, toKey: K, toInclusive: boolean): NavigableMap<K, V>;
	public subMap(fromKey: K, fromInclusiveOrKey: boolean | K, param3?: K, param4?: boolean): NavigableMap<K, V> {
		let fromInclusive: boolean;
		let toKey: K;
		let toInclusive: boolean;
		if (typeof fromInclusiveOrKey === 'boolean') {
			fromInclusive = fromInclusive;
			toKey = param3;
			toInclusive = param4;
		} else {
			fromInclusive = false;
			toKey = fromInclusiveOrKey;
			toInclusive = false;
		}
		if (!this.inRange(fromKey, fromInclusive)) {
			throw new IllegalArgumentException();
		} else if (this.inRange(toKey, toInclusive)) {
			throw new IllegalArgumentException();
		}
		return new AscendingSubMap(this.map, false, fromKey, fromInclusive, false, toKey, toInclusive);
	}

	public headMap(toKey: K): NavigableMap<K, V>;
	public headMap(toKey: K, toInclusive: boolean): NavigableMap<K, V>;
	public headMap(toKey: K, toInclusive?: boolean): NavigableMap<K, V> {
		return null;
	}

	public tailMap(toKey: K): NavigableMap<K, V>;
	public tailMap(fromKey: K, fromInclusive: boolean): NavigableMap<K, V>;
	public tailMap(fromKey: K, fromInclusive?: boolean): NavigableMap<K, V> {
		return null;
	}

	public descendingMap(): NavigableMap<K, V> {
		return null;
	}

	public keyIterator(): Iterator<K> {
		return null;
	}

	public descendingKeyIterator(): Iterator<K> {
		return null;
	}

	public entrySet(): Set<TreeMapEntry<K, V>> {
		return null;
	}

	public subLowest(): TreeMapEntry<K, V> {
		return this.absLowest();
	}

	public subHighest(): TreeMapEntry<K, V> { return this.absHighest(); }
	
	public subCeiling(key: K) { 
		return this.absCeiling(key); 
	}
	
	public subHigher(key: K) { 
		return this.absHigher(key); 
	}
	
	public subFloor(key: K) { 
		return this.absFloor(key); 
	}
	
	public subLower(key: K) { 
		return this.absLower(key); 
	}
}