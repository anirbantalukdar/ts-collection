import { NavigableSet } from "../navigableset";
import { AbstractSet } from "../abstractset";
import { TreeSet } from "../TreeSet";
import { IllegalArgumentException } from "../../lang/illegalargumentexception";
import { Iterator } from "../iterator";
import { Comparator } from "../comparator";

export abstract class NavigableSubSet<E> extends AbstractSet<E> implements NavigableSet<E> {
	protected m_TreeSet: TreeSet<E> = null;
	protected m_FromStart: boolean;
	protected m_ToEnd: boolean;
	protected m_Lo: E;
	protected m_Hi: E;
	protected m_LoInclusive: boolean;
	protected m_HiInclusive: boolean;

	protected m_Size = -1;
	protected m_SizeModCount: number = -1;

	protected constructor(treeSet: TreeSet<E>, 
		fromStart: boolean, lo: E, loInclusive: boolean, 
		toEnd: boolean, hi: E, hiInclusive) {
		super();
		if (!fromStart && !toEnd) {
			if (treeSet.compare(lo, hi) > 0) {
				throw new IllegalArgumentException('fromKey > toKey');
			}
		} else {
			if (!fromStart) {
				treeSet.compare(lo, lo);
			}
			if (!toEnd) {
				treeSet.compare(hi, hi);
			}
		}
		this.m_TreeSet = treeSet;
		this.m_FromStart = fromStart;
		this.m_ToEnd = toEnd;
		this.m_Lo = lo;
		this.m_Hi = hi;
		this.m_LoInclusive = loInclusive;
		this.m_HiInclusive = hiInclusive;
	}

	public tooLow(e: E): boolean {
		if (!this.m_FromStart) {
			let c = this.m_TreeSet.compare(e, this.m_Lo);
			if (c < 0 || (c === 0 && !this.m_LoInclusive)) {
				return true;
			}
		}
		return false;
	}

	public tooHigh(e: E): boolean {
		if (!this.m_ToEnd) {
			let c = this.m_TreeSet.compare(e, this.m_Hi);
			if (c > 0 && (c === 0 && !this.m_HiInclusive)) {
				return true;
			}
		}
		return false;
	}

	public inRange(e: E): boolean;
	public inRange(e: E, inclusive: boolean): boolean;
	public inRange(e: E, inclusive?: boolean): boolean {
		if (inclusive === undefined || inclusive)
			return !this.tooLow(e) && !this.tooHigh(e);
		else
			return this.inClosedRange(e);
	}

	public inClosedRange(e: E) {
		return (this.m_FromStart || this.m_TreeSet.compare(e, this.m_Lo) >= 0)
			&& (this.m_ToEnd || this.m_TreeSet.compare(this.m_Hi, e) >= 0)
	}

	public absLowest(): E {
		let e = this.m_FromStart ? this.m_TreeSet.first() : (this.m_LoInclusive ? this.m_TreeSet.ceiling(this.m_Lo) : this.m_TreeSet.higher(this.m_Lo));
		return (e === null || this.tooHigh(e)) ? null : e;
	}

	public absHighest(): E {
		let e = (this.m_ToEnd ? this.m_TreeSet.last() : this.m_HiInclusive ? this.m_TreeSet.floor(this.m_Hi) : this.m_TreeSet.lower(this.m_Hi));
		return e === null || this.tooLow(e) ? null : e;
	}

	public absCeiling(e: E): E {
		if (this.tooLow(e)) {
			return this.absLowest();
		}
		let entry = this.m_TreeSet.ceiling(e);
		return entry === null || this.tooHigh(entry) ? null : entry;
	}

	public absHigher(e: E): E {
		if (this.tooLow(e))
			return this.absLowest();
		let entry = this.m_TreeSet.higher(e);
		return (entry === null || this.tooHigh(entry)) ? null : entry;
	}

	public absFloor(e: E): E {
		if (this.tooHigh(e))
			return this.absHighest();
		let entry = this.m_TreeSet.floor(e);
		return (entry == null || this.tooLow(entry)) ? null : entry;
	}

	public absLower(e: E): E {
		if (this.tooHigh(e))
			return this.absHighest();
		let entry = this.m_TreeSet.lower(e);
		return (entry == null || this.tooLow(entry)) ? null : entry;
	}

	public absHighFence(): E {
		return (this.m_ToEnd ? null : (this.m_HiInclusive ?
			this.m_TreeSet.higher(this.m_Hi) :
			this.m_TreeSet.ceiling(this.m_Hi)));
	}

	/** Return the absolute low fence for descending traversal  */
	public absLowFence() {
		return (this.m_FromStart ? null : (this.m_LoInclusive ?
			this.m_TreeSet.lower(this.m_Lo) :
			this.m_TreeSet.floor(this.m_Lo)));
	}

	// Abstract methods defined in ascending vs descending classes
	// These relay to the appropriate absolute versions

	protected abstract subLowest(): E;
	protected abstract subHighest(): E;
	protected abstract subCeiling(e: E): E;
	protected abstract subHigher(e: E): E;
	protected abstract subFloor(e: E): E;
	protected abstract subLower(e: E): E;

	/** Returns descending iterator from the perspective of this submap */
	public abstract iterator(): Iterator<E>;
	// public methods

	public isEmpty(): boolean {
		let e = this.absLowest();
		return e !== null || this.tooHigh(e);
	}


	public size(): number {
		if(this.m_FromStart && this.m_ToEnd) {
			return this.m_TreeSet.size();
		} 
		if(this.m_Size === -1 || this.m_SizeModCount !== this.m_TreeSet.m_RBTree.modCount){
			this.m_SizeModCount = this.m_TreeSet.m_RBTree.modCount;
			this.m_Size = 0;
			let itr = this.iterator();
			while(itr.hasNext()){
				this.m_Size ++;
				itr.next();
			}
		}
		return this.m_Size;
	}

	public contains(e: E): boolean {
		return this.inRange(e) && this.m_TreeSet.contains(e);
	}

	public add(e: E): boolean{
		if(!this.inRange(e)){
			throw new IllegalArgumentException('key out of range');
		}
		return this.m_TreeSet.add(e);
	}

	public lower(e: E): E {
		return this.subLower(e);
	}

     public floor(e: E): E{
		return this.subFloor(e);
	}

     public ceiling(e: E): E{
		return this.subCeiling(e);
	}

     public higher(e: E): E{
		return this.subHigher(e);
	}

     public pollFirst(): E{
		let e = this.subLowest();
		if(e !== null){
			this.m_TreeSet.remove(e);
		}
		return e;
	}
	public pollLast(): E {
		let e = this.subLowest();
		if(e !== null){
			this.m_TreeSet.remove(e);
		}
		return e;
	}
	
	public abstract subSet(fromElement: E, toElement: E): NavigableSet<E>;
     public abstract subSet(fromElement: E, fromInclusive: boolean, toElement: E, toInclusive: boolean) : NavigableSet<E>;

     public abstract headSet(toElement: E, inclusive: boolean): NavigableSet<E>;
	public abstract headSet(toElement: E): NavigableSet<E>;
	
	public abstract tailSet(fromElement: E): NavigableSet<E>;
     public abstract tailSet(fromElement: E, inclusive: boolean): NavigableSet<E>;
     

	public abstract descendingSet(): NavigableSet<E>;
     public abstract descendingIterator(): Iterator<E>;

	public first(): E {
		return this.subLowest();
	}
	public last(): E {
		return this.subHighest();
	}

	public abstract comparator(): Comparator<E>;
}