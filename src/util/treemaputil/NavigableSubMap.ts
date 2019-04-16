import { AbstractMap } from "../abstractmap";
import { NavigableMap } from "../navigablemap";
import { TreeMap } from "../treemap";
import { IllegalArgumentException } from "../../lang/illegalargumentexception";
import { TreeMapEntry } from "./TreeMapEntry";
import { MapEntry } from "../map";
import { NavigableSet } from "../navigableset";
import { TreeMapKeySet } from "./TreeMapKeySet";
import { Set } from "../set";
import { Iterator } from "../iterator";
import { Comparator } from "../comparator";

export abstract class NavigableSubMap<K, V> extends AbstractMap<K, V> implements NavigableMap<K, V> {
	constructor(protected map: TreeMap<K, V>,
		protected m_FromStart: boolean, protected lo: K, protected loInclusive: boolean,
		protected m_ToEnd: boolean, protected hi: K, protected hiInclusive: boolean) {
		super();
		
		if (!m_FromStart && !m_ToEnd) {
			if (this.map.compareKeys(lo, hi) > 0) {
				throw new IllegalArgumentException('fromKey > toKey');
			}
		} else {
			if (!m_FromStart) {
				this.map.compareKeys(lo, lo);
			}
			if (!m_ToEnd) {
				this.map.compareKeys(hi, hi);
			}
		}
	}


	public abstract comparator(): Comparator<K>;

	public get modCount(): number {
		return this.map.modCount;
	}

	public get fromStart(): boolean {
		return this.m_FromStart;
	}

	public get toEnd(): boolean {
		return this.m_ToEnd;
	}
	public tooLow(key: K): boolean {
		if (!this.m_FromStart) {
			let c = this.map.compareKeys(key, this.lo);
			if (c < 0 || (c === 0 && !this.loInclusive)) {
				return true;
			}
		}
		return false;
	}

	public tooHigh(key: K) {
		if (!this.m_ToEnd) {
			let c = this.map.compareKeys(key, this.hi);
			if (c > 0 || (c === 0 && !this.hiInclusive)) {
				return true;
			}
		}
		return false;
	}

	public inRange(key: K): boolean;
	public inRange(key: K, inclusive: boolean): boolean;
	public inRange(key: K, inclusive?: boolean): boolean {
		let inc = true;
		if (inclusive !== undefined) {
			inc = inclusive;
		}
		if (inc) {
			return !this.tooLow(key) && !this.tooHigh(key);
		} else {
			return this.inClosedRange(key);
		}
	}

	protected inClosedRange(key: K) {
		return (this.m_FromStart || this.map.compareKeys(key, this.lo) >= 0) && (this.m_ToEnd || this.map.compareKeys(this.hi, key) >= 0);
	}

	public absLowest(): TreeMapEntry<K, V> {
		let e: TreeMapEntry<K, V> = null;
		if (this.m_FromStart) {
			e = this.map.firstEntry() as TreeMapEntry<K, V>;
		} else {
			if (this.loInclusive) {
				e = this.map.ceilingEntry(this.lo) as TreeMapEntry<K, V>;
			} else {
				e = this.map.higherEntry(this.lo) as TreeMapEntry<K, V>;
			}
		}
		if (e === null || this.tooHigh(e.key)) {
			return null;
		}
		return e;
	}

	public absHighest(): TreeMapEntry<K, V> {
		let e: TreeMapEntry<K, V> = null;
		if (this.m_ToEnd) {
			e = this.map.lastEntry() as TreeMapEntry<K, V>;
		} else {
			if (this.hiInclusive) {
				e = this.map.floorEntry(this.hi) as TreeMapEntry<K, V>;
			} else {
				e = this.map.lowerEntry(this.hi) as TreeMapEntry<K, V>;
			}
		}
		if (e === null || this.tooLow(e.key)) {
			return null;
		}
		return e;
	}

	public  absCeiling(key: K): TreeMapEntry<K, V> {
		if (this.tooLow(key)) {
			return this.absLowest();
		}
		let e = this.map.ceilingEntry(key) as TreeMapEntry<K, V>;
		if (e === null || this.tooHigh(e.key)) {
			return null;
		}
		return e;
	}

	public absHigher(key: K): TreeMapEntry<K, V> {
		if (this.tooLow(key)) {
			return this.absLowest();
		}
		let e = this.map.ceilingEntry(key) as TreeMapEntry<K, V>;
		if (e === null || this.tooHigh(e.getKey())) {
			return null;
		}
		return e;
	}

	public absFloor(key: K): TreeMapEntry<K, V> {
		if (this.tooHigh(key)) {
			return this.absHighest();
		}
		let e = this.map.lowerEntry(key) as TreeMapEntry<K, V>;
		if (e === null || this.tooLow(e.key)) {
			return null;
		}
		return e;
	}

	public absLower(key: K): TreeMapEntry<K, V> {
		if (this.tooHigh(key)) {
			return this.absHigher(key);
		}
		let e = this.map.lowerEntry(key) as TreeMapEntry<K, V>;
		if (e === null || this.tooLow(e.key)) {
			return null;
		}
		return e;
	}

	public absHighFence(): TreeMapEntry<K, V> {
		if (this.m_ToEnd) {
			return null;
		} else {
			if (this.hiInclusive) {
				return this.map.higherEntry(this.hi) as TreeMapEntry<K, V>;
			} else {
				return this.map.ceilingEntry(this.hi) as TreeMapEntry<K, V>;
			}
		}
	}

	public absLowFence(): TreeMapEntry<K, V> {
		if (this.m_FromStart) {
			return null;
		} else {
			if (this.loInclusive) {
				return this.map.lowerEntry(this.lo) as TreeMapEntry<K, V>;
			} else {
				return this.map.ceilingEntry(this.hi) as TreeMapEntry<K, V>;
			}
		}
	}

	public abstract subLowest(): TreeMapEntry<K, V>;
	public abstract subHighest(): TreeMapEntry<K, V>;
	public abstract subCeiling(key: K): TreeMapEntry<K, V>;
	public abstract subHigher(key: K): TreeMapEntry<K, V>;
	public abstract subFloor(key: K): TreeMapEntry<K, V>;
	public abstract subLower(key: K): TreeMapEntry<K, V>;

	public abstract keyIterator(): Iterator<K>;
	public abstract descendingKeyIterator(): Iterator<K>;

	public isEmpty(): boolean {
		return (this.m_FromStart && this.m_ToEnd) ? this.map.isEmpty() : this.entrySet().isEmpty();
	}

	public size(): number {
		return (this.m_FromStart && this.m_ToEnd) ? this.map.size() : this.entrySet().size();
	}

	public containsKey(key: K): boolean {
		return this.inRange(key) && this.map.containsKey(key);
	}

	public put(key: K, value: V): V {
		if (!this.inRange(key)) {
			throw new IllegalArgumentException("Key out of range");
		}
		return this.map.put(key, value);
	}

	public get(key: K): V {
		if (!this.inRange(key)) {
			return null;
		}
		return this.map.get(key);
	}

	public remove(key: K): V {
		return !this.inRange(key) ? null : this.map.remove(key);
	}

	public ceilingEntry(key: K) {
		return this.map.exportEntry(this.subCeiling(key));
	}

	public ceilingKey(key: K): K {
		return TreeMap.keyOrNull(this.subCeiling(key));
	}

	public higherEntry(key: K) {
		return this.map.exportEntry(this.subHigher(key));
	}

	public higherKey(key: K) {
		return TreeMap.keyOrNull(this.subHigher(key));
	}

	public floorEntry(key: K) {
		return this.map.exportEntry(this.subFloor(key));
	}

	public floorKey(key: K) {
		return TreeMap.keyOrNull(this.subFloor(key));
	}

	public lowerEntry(key: K) {
		return this.map.exportEntry(this.subLower(key));
	}

	public lowerKey(key: K) {
		return TreeMap.keyOrNull(this.subLower(key));
	}

	public firstKey() {
		return TreeMap.keyOrNull(this.subLowest());
	}

	public lastKey() {
		return TreeMap.keyOrNull(this.subHighest());
	}

	public firstEntry() {
		return this.map.exportEntry(this.subLowest());
	}

	public lastEntry() {
		return this.map.exportEntry(this.subHighest());
	}

	public pollFirstEntry(): MapEntry<K, V> {
		let e = this.subLowest();
		let result = this.map.exportEntry(e);
		if(e !== null){
			this.map.remove(e.getKey());
		}
		return result;
	}

	public pollLastEntry(): MapEntry<K, V> {
		let e = this.subHighest();
		let result = this.map.exportEntry(e);
		if(e !== null){
			this.map.remove(e.getKey());
		}
		return result;
	}

	private navigableKeySetView : TreeMapKeySet<K, V> = null;
	public navigableKeySet(): NavigableSet<K> {
		if(this.navigableKeySetView === null){
			this.navigableKeySetView = new TreeMapKeySet(this.map);
		}
		return this.navigableKeySetView;
	}

	public keySet(): Set<K> {
		return this.navigableKeySet();
	}

	public descendingKeySet(): NavigableSet<K> {
		return this.descendingMap().navigableKeySet();
	}

	public abstract descendingMap(): NavigableMap<K, V>;

	public abstract subMap(fromKey: K, fromInclusive: boolean, toKey: K, toInclusive: boolean): NavigableMap<K, V>;
     public abstract subMap(fromKey: K, toKey: K): NavigableMap<K, V>;

     public abstract headMap(toKey: K): NavigableMap<K, V>;
     public abstract headMap(toKey: K, toInclusive: boolean): NavigableMap<K, V>;
     
     public abstract tailMap(toKey: K): NavigableMap<K, V>;
     public abstract tailMap(fromKey: K, fromInclusive: boolean): NavigableMap<K, V>;

}