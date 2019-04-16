import { NavigableSet } from "../navigableset";
import { TreeSet } from "../TreeSet";
import { NavigableSubSet } from "./NavigableSubSet";
import { Collections } from "../Collections";
import { Comparator } from "../comparator";
import { IllegalArgumentException } from "../../lang/illegalargumentexception";
import { AscendingSubSet } from "./AscendingSubSet";
import { Iterator } from "../iterator";
import { DescendingSubSetIterator } from "./DescendingSubSetIterator";

export class DescendingSubSet<E> extends NavigableSubSet<E> implements NavigableSet<E>{
	private reverseComparator: Comparator<E>;

	public constructor(treeSet: TreeSet<E>,
		fromStart: boolean, lo: E, loInclusive: boolean,
		toEnd: boolean, hi: E, hiInclusive: boolean) {
		super(treeSet, fromStart, lo, loInclusive, toEnd, hi, hiInclusive);
		this.reverseComparator = Collections.reverseOrder(this.m_TreeSet.comparator())
	}

	public comparator(): Comparator<E> {
		return this.reverseComparator;
	}

	public subSet(fromElement: E, toElement: E): NavigableSet<E>;
	public subSet(fromElement: E, fromInclusive: boolean, toElement: E, toInclusive: boolean): NavigableSet<E>;
	public subSet(fromElement: E, fromInclusiveOrToElement: boolean | E, param3?: E, param4?: boolean) {
		let fromInclusive: boolean;
		let toElement: E = null;
		let toInclusive: boolean;
		if (typeof fromInclusiveOrToElement === 'boolean') {
			fromInclusive = fromInclusiveOrToElement;
			toElement = param3;
			toInclusive = param4;
		} else {
			toElement = fromInclusiveOrToElement;
			toInclusive = true;
			fromInclusive = false;
		}
		if (!this.inRange(fromElement, fromInclusive)) {
			throw new IllegalArgumentException('fromKey out of range');
		}
		if (!this.inRange(toElement, toInclusive)) {
			throw new IllegalArgumentException('toKey out of range');
		}
		return new DescendingSubSet(this.m_TreeSet, false, toElement, toInclusive, false, fromElement, fromInclusive)
	}

	public headSet(toElement: E): NavigableSet<E>;
	public headSet(toElement: E, inclusive: boolean): NavigableSet<E>;
	public headSet(toElement: E, inclusive?: boolean): NavigableSet<E> {
		if (inclusive === undefined) {
			inclusive = false;
		}
		if (!this.inRange(toElement, inclusive)) {
			throw new IllegalArgumentException('toKey out of range');
		}
		return new DescendingSubSet(this.m_TreeSet, false, toElement, inclusive, this.m_ToEnd, this.m_Hi, this.m_HiInclusive);
	}

	public tailSet(fromElement: E): NavigableSet<E>;
	public tailSet(fromElement: E, inclusive: boolean): NavigableSet<E>;
	public tailSet(fromElement: E, inclusive?: boolean): NavigableSet<E> {
		if (inclusive === undefined) {
			inclusive = true;
		}
		if (!this.inRange(fromElement, inclusive)) {
			throw new IllegalArgumentException('fromElement out of range');
		}
		return new DescendingSubSet(this.m_TreeSet, this.m_FromStart, this.m_Lo, this.m_LoInclusive, false, fromElement, inclusive);
	}

	public descendingSet(): NavigableSet<E> {
		return new AscendingSubSet(this.m_TreeSet,
			this.m_FromStart, this.m_Lo, this.m_LoInclusive,
			this.m_ToEnd, this.m_Hi, this.m_HiInclusive);
	}

	public iterator(): Iterator<E> {
		return new DescendingSubSetIterator(this.m_TreeSet, this.absHighest(), this.absLowFence());
	}

	public descendingIterator(): Iterator<E> {
		return new DescendingSubSetIterator(this.m_TreeSet, this.absHighest(), this.absLowFence());
	}

	public subLowest() { 
		return this.absHighest(); 
	}
	
	public subHighest() { 
		return this.absLowest(); 
	}
	
	public subCeiling(e: E) { 
		return this.absFloor(e); 
	}
	
	public subHigher(e: E) { 
		return this.absLower(e); 
	}
	
	public subFloor(e: E) { 
		return this.absCeiling(e); 
	}

	public subLower(e: E) { 
		return this.absHigher(e); 
	}
}