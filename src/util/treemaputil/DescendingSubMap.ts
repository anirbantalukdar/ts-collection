import { NavigableSubMap } from "../treemaputil/NavigableSubMap";
import { TreeMap } from "../treemap";
import { Collections } from "../Collections";
import { Comparator } from "../comparator";
import { IllegalArgumentException } from "../../lang/illegalargumentexception";
import { NavigableMap } from "../navigablemap";
import { Iterator } from "../iterator";
import { Set } from "../set";
import { TreeMapEntry } from "../treemaputil/TreeMapEntry";
import { AscendingSubMap } from "./AscendingSubMap";
import { DescendingSubMapKeyIterator } from "./DescendingSubMapKeyIterator";

export class DescendingSubMap<K, V> extends NavigableSubMap<K, V> {
	private m_Comparator : Comparator<K> = null;

	public constructor(map: TreeMap<K, V>,
          fromStart: boolean, lo: K, loInclusive: boolean,
          toEnd: boolean, hi: K, hiInclusive: boolean){
		super(map, fromStart, lo, loInclusive, toEnd, hi, hiInclusive);
		this.m_Comparator = Collections.reverseOrder(this.map.comparator());
	}
	
	public comparator(): Comparator<K> {
		return this.m_Comparator;
	}

	public subMap(fromKey: K, toKey: K, ): NavigableMap<K, V>;
	public subMap(fromKey: K, fromInclusive: boolean, toKey: K, toInclusive: boolean): NavigableMap<K, V>;
	public subMap(fromKey: K, fromInclusiveOrToKey: boolean | K, param3 ?: K, param4 ?: boolean): NavigableMap<K, V> {
		let fromInclusive : boolean = false;
		let toKey: K = undefined;
		let toInclusive: boolean = false;
		if(typeof fromInclusiveOrToKey === 'boolean'){
			fromInclusive = fromInclusiveOrToKey;
			toKey = param3;
			toInclusive = param4;
		}else {
			toKey = fromInclusiveOrToKey;
			fromInclusive = false;
			toInclusive = false;
		}
		if(!this.inRange(fromKey, fromInclusive)){
			throw new IllegalArgumentException();
		}
		if(!this.inRange(toKey, toInclusive)){
			throw new IllegalArgumentException();
		}
		return new DescendingSubMap(this.map, false, toKey, toInclusive, false, fromKey, fromInclusive);
	}

	public headMap(toKey: K): NavigableMap<K, V>;
	public headMap(toKey: K, inclusive: boolean): NavigableMap<K, V>;
	public headMap(toKey: K, inclusive ?: boolean): NavigableMap<K, V>{
		if(!this.inRange(toKey, inclusive)){
			throw new IllegalArgumentException();
		}
		return new DescendingSubMap(this.map, false, toKey, this.loInclusive, this.toEnd, this.hi, this.hiInclusive);
	}

	public tailMap(fromKey: K): NavigableMap<K, V>;
	public tailMap(fromKey: K, inclusive: boolean): NavigableMap<K, V>;
	public tailMap(fromKey: K, inclusive ?: boolean): NavigableMap<K, V> {
		if(!this.inRange(fromKey, inclusive)){
			throw new IllegalArgumentException();
		}
		return new DescendingSubMap(this.map, this.fromStart, this.lo, this.loInclusive, false, fromKey, inclusive);
	}

	public descendingMap(): NavigableMap<K,V> {
		return new AscendingSubMap(this.map, this.fromStart, this.lo, this.loInclusive, this.toEnd, this.hi, this.hiInclusive);
	}

	public keyIterator(): Iterator<K> {
		return new DescendingSubMapKeyIterator(this.map, this.absHighest(), this.absLowFence());
	}

	public descendingKeyIterator(): Iterator<K> {
		return null;
	}

	public entrySet(): Set<TreeMapEntry<K, V>> {
		return null;
	}

	public subLowest() : TreeMapEntry<K, V> { 
		return this.absHighest(); 
	}

	public subHighest() : TreeMapEntry<K, V> { 
		return this.absLowest(); 
	}
	
	public subCeiling(key: K) : TreeMapEntry<K, V> { 
		return this.absFloor(key); 
	}
	
	public subHigher(key: K) : TreeMapEntry<K, V> { 
		return this.absLower(key); 
	}

	public subFloor(key: K) : TreeMapEntry<K, V> { 
		return this.absCeiling(key); 
	}
	
	public subLower(key: K) : TreeMapEntry<K, V> { 
		return this.absHigher(key); 
	}
}
