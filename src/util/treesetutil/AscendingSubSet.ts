import { NavigableSubSet } from "./NavigableSubSet";
import { TreeSet } from "../TreeSet";
import { Comparator } from "../comparator";
import { NavigableSet } from "../navigableset";
import { IllegalArgumentException } from "../../lang/illegalargumentexception";
import { DescendingSubSet } from "./DescendingSubSet";
import { Iterator } from "../iterator";
import { DescendingSubSetIterator } from "./DescendingSubSetIterator";
import { AscendingSubSetIterator } from "./AscendingTreeSetIterator";

export class AscendingSubSet<E> extends NavigableSubSet<E> {
	constructor(treeSet: TreeSet<E>, 
		fromStart: boolean, lo: E, loInclusive,
		toEnd: boolean, hi: E, hiInclusive){
		
		super(treeSet, fromStart, lo, loInclusive, toEnd, hi, hiInclusive);
	}

	public comparator(): Comparator<E> {
		return this.m_TreeSet.comparator();
	}

	public iterator(): Iterator<E> {
		return new AscendingSubSetIterator(this.m_TreeSet, this.absLowest(), this.absHighFence());
	}
	public subSet(fromElement: E, toElement: E): NavigableSet<E>;
	public subSet(fromElement: E, fromInclusive: boolean, toElement: E, toInclusive: boolean) : NavigableSet<E>;
	public subSet(fromElement: E, fromInclusiveOrToElement: boolean | E, param2 ?: E, param3 ?: boolean) : NavigableSet<E>{
		let fromInclusive: boolean = true;
		let toElement: E = null;
		let toInclusive: boolean = false;
		if(typeof fromInclusiveOrToElement === 'boolean'){
			fromInclusive = fromInclusiveOrToElement;
			toElement = param2;
			toInclusive = param3;
		}else {
			toElement = fromInclusiveOrToElement;
		}
		if(!this.inRange(fromElement, fromInclusive)){
			throw new IllegalArgumentException('fromElement out of range');
		}
		if(!this.inRange(toElement, toInclusive)){
			throw new IllegalArgumentException('toElement out of range');
		}
		return new AscendingSubSet(this.m_TreeSet, false, fromElement, fromInclusive, false, toElement, toInclusive);
	}

     public headSet(toElement: E): NavigableSet<E>;
	public headSet(toElement: E, inclusive: boolean): NavigableSet<E>;
	public headSet(toElement: E, inclusive ?: boolean): NavigableSet<E>{
		if(inclusive === undefined){
			inclusive = false;
		}
		if(!this.inRange(toElement, inclusive)){
			throw new IllegalArgumentException('toElement out of range');
		}
		return new AscendingSubSet(this.m_TreeSet, 
			this.m_FromStart, this.m_Lo, this.m_LoInclusive, 
			false, toElement, inclusive);
	}

	public tailSet(fromElement: E): NavigableSet<E>;
	public tailSet(fromElement: E, inclusive: boolean): NavigableSet<E>;
	public tailSet(fromElement: E, inclusive ?: boolean): NavigableSet<E>{
		if(inclusive === undefined){
			inclusive = true;
		}
		if(!this.inRange(fromElement, inclusive)){
			throw new IllegalArgumentException('fromElement out of range');
		}
		return new AscendingSubSet(this.m_TreeSet,
			false, fromElement, inclusive, 
			this.m_ToEnd, this.m_Hi, this.m_HiInclusive);
	}
	
	public descendingIterator(): Iterator<E> {
		return new DescendingSubSetIterator(this.m_TreeSet, this.absHighest(), this.absLowest());
	}

	public descendingSet(): NavigableSet<E> {
		return new DescendingSubSet(this.m_TreeSet,
			this.m_FromStart, this.m_Lo, this.m_LoInclusive,
			this.m_ToEnd, this.m_Hi, this.m_HiInclusive);
	}

	protected subLowest() : E { 
		return this.absLowest(); 
	}
     protected subHighest() : E { 
		return this.absHighest(); 
	}
	
	protected subCeiling(e: E) { 
		return this.absCeiling(e); 
	}

	protected subHigher(e: E)  { 
		return this.absHigher(e); 
	}
	   
	protected subFloor(e: E) { 
		return this.absFloor(e); 
	}
	
	protected subLower(e: E) { 
		return this.absLower(e); 
	}
}