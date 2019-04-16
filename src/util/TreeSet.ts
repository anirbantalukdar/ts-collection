import { AbstractSet } from "./abstractset";
import { NavigableSet } from "./navigableset";
import { Iterator } from "./iterator";
import { Comparator, isComparator } from "./comparator";
import { RedBlackTree } from "./RedBlackTree";
import { SortedSet } from "./sortedset";
import { Collection } from "./collection";
import { TreeSetItetor, DescendingTreeSetIterator } from "./treesetutil/TreeSetIterator";
import { DescendingSubSet } from "./treesetutil/DescendingSubSet";
import { AscendingSubSet } from "./treesetutil/AscendingSubSet";

export class TreeSet<E> extends AbstractSet<E> implements NavigableSet<E> {
	m_RBTree : RedBlackTree<E>;
	private m_Comparator: Comparator<E>;

	constructor(param: Comparator<E> | SortedSet<E> | Collection<E>){
		super();
		this.m_Comparator = null;

		if(isComparator(param)){
			this.m_Comparator = param;
		}
		this.m_RBTree = new RedBlackTree(this.m_Comparator);

		if(this.m_Comparator === null && param !== null){
			let c = <any>param as Collection<E>;
			this.addAll(c);
		}
	}

	public iterator(): Iterator<E>{
		return new TreeSetItetor<E>(this);
	}

	public size(): number {
		return this.m_RBTree.size();;
	}
	
	public contains(e: E): boolean {
		return this.m_RBTree.contains(e);
	}

	public first(): E {
		let node = this.m_RBTree.getFirstNode();
		return RedBlackTree.entryOrNull(node);
	}

     public last(): E{
		let node = this.m_RBTree.getLastNode();
		return RedBlackTree.entryOrNull(node);
	}

	public add(e: E): boolean {
		return this.m_RBTree.put(e) !== null;
	}
	public ceiling(e: E): E {
		let node = this.m_RBTree.getCeilingNode(e);
		return RedBlackTree.entryOrNull(node);
	}

	public floor(e: E): E {
		let node = this.m_RBTree.getFloorNode(e);
		return RedBlackTree.entryOrNull(node);
	}

	public higher(e: E): E {
		let node = this.m_RBTree.getHigherNode(e);
		return RedBlackTree.entryOrNull(node);
	}

	public lower(e: E): E {
		let entry = this.m_RBTree.getLowerNode(e);
		return RedBlackTree.entryOrNull(entry);
	}

	public remove(e: E): boolean {
		let entry = this.m_RBTree.getRedBlackTreeNode(e);
		if(entry === null){
			return false;
		}
		this.m_RBTree.deleteEntry(entry);
		return true;
	}

	public clear(): void {
		this.m_RBTree.clear();
	}

	public pollFirst(): E {
		let node = this.m_RBTree.getFirstNode();
		let result = RedBlackTree.entryOrNull(node);
		if(node !== null){
			this.m_RBTree.deleteEntry(node);
		}
		return result;
	}

	public pollLast(): E {
		let node = this.m_RBTree.getLastNode();
		let result = RedBlackTree.entryOrNull(node);
		if(node !== null){
			this.m_RBTree.deleteEntry(node);
		}
		return result;
	}

	public descendingSet(): NavigableSet<E>{
		return new DescendingSubSet(this, 
			true, null, true, 
			true, null, true);
	}

     public descendingIterator(): Iterator<E>{
		return new DescendingTreeSetIterator(this);
	}

     public subSet(fromElement: E, toElement: E): NavigableSet<E>;
	public subSet(fromElement: E, fromInclusive: boolean, toElement: E, toInclusive: boolean) : NavigableSet<E>;
	public subSet(fromElement: E, fromInclusiveOrToElement: boolean | E, param3 ?: E, param4 ?: boolean) : NavigableSet<E>{
		let fromInclusive : boolean = true;
		let toElement: E = null;
		let toInclusive : boolean = false;
		if(typeof fromInclusiveOrToElement === 'boolean'){
			fromInclusive = fromInclusiveOrToElement;
			toElement = param3;
			toInclusive = param4;
		}else {
			toElement = fromInclusiveOrToElement;
		}
		return new AscendingSubSet(this, 
			false, fromElement, fromInclusive, 
			false, toElement, toInclusive);
	}

     public headSet(toElement: E): NavigableSet<E>;
	public headSet(toElement: E, inclusive: boolean): NavigableSet<E>;
	public headSet(toElement: E, inclusive?: boolean): NavigableSet<E>{
		if(inclusive === undefined){
			inclusive = false;
		}
		return new AscendingSubSet(this, 
			true, null, true,
			false, toElement, inclusive);
	}

	public tailSet(fromElement: E): NavigableSet<E>;
	public tailSet(fromElement: E, inclusive: boolean): NavigableSet<E>;
	public tailSet(fromElement: E, inclusive ?: boolean): NavigableSet<E>{
		if(inclusive === undefined){
			inclusive = true;
		}
		return new AscendingSubSet(this, false, fromElement, inclusive, true, null, true);
	}
     
     public comparator(): Comparator<E>{
		return this.m_Comparator;
	}

	public compare(e1: E, e2: E): number {
		return this.m_RBTree.compareValues(e1, e2);
	}
}