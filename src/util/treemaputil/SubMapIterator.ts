import { Iterator } from "../iterator";
import { TreeMapEntry } from "./TreeMapEntry";
import { TreeMap } from "../treemap";
import { NoSuchElementException } from "../nosuchelementexception";
import { ConcurrentModificationException } from "../concurrentmodificationexception";
import { IllegalStateException } from "../../lang/illegalstateexception";
import { RedBlackTreeNode, RedBlackTree } from "../RedBlackTree";

export abstract class SubMapIterator<K, V> implements Iterator<TreeMapEntry<K, V>> {
	protected m_LastRetruned: RedBlackTreeNode<TreeMapEntry<K, V>> = null;
	protected m_NextNode: RedBlackTreeNode<TreeMapEntry<K, V>> = null;
	protected m_FenceKeyNode: RedBlackTreeNode<TreeMapEntry<K, V>> = null;
	protected m_Unbounded: boolean = false;
	protected expectedModCount: number;
	protected m_rbTree : RedBlackTree<TreeMapEntry<K, V>> = null;

	constructor(protected map: TreeMap<K, V>, first: RedBlackTreeNode<TreeMapEntry<K, V>>, fence: RedBlackTreeNode<TreeMapEntry<K, V>>){
		this.expectedModCount = this.map.modCount;
		this.m_LastRetruned = null;
		this.m_NextNode = first;
		this.m_Unbounded = true;
		this.m_FenceKeyNode = null;
		if(fence !== null){
			this.m_FenceKeyNode = fence;
			this.m_Unbounded = false;
		}
		this.m_rbTree = map.m_RedBlackTree;
	}

	public hasNext(): boolean {
		if(this.m_NextNode === null){
			return false;
		}else {
			if(this.m_FenceKeyNode === this.m_NextNode){
				return false;
			}else{
				return true;
			}
		}	
	}

	public next(): TreeMapEntry<K, V> {
		return null;
	}

	public iterator(): TreeMapEntry<K, V> {
		return null;
	}

	public abstract remove(): void;

	protected nextEntry(): TreeMapEntry<K, V> {
		let e = this.m_NextNode;
		if(e === null || e === this.m_FenceKeyNode){
			throw new NoSuchElementException();
		}
		if(this.expectedModCount !== this.map.modCount){
			throw new ConcurrentModificationException();
		}
		this.m_NextNode = this.m_rbTree.successor(e);
		this.m_LastRetruned = e;
		return RedBlackTree.entryOrNull(e);
	}

	protected prevEntry(): TreeMapEntry<K, V> {
		let e = this.m_NextNode;
		if(e === null || e === this.m_FenceKeyNode){
			throw new NoSuchElementException();
		}
		if(this.expectedModCount !== this.map.modCount){
			throw new ConcurrentModificationException();
		}
		this.m_NextNode = this.m_rbTree.predecessor(e);
		this.m_LastRetruned = e;
		return RedBlackTree.entryOrNull(e);
	}

	protected removeAscending(): void {
		if(this.m_LastRetruned === null){
			throw new IllegalStateException();
		}
		if(this.expectedModCount !== this.map.modCount){
			throw new ConcurrentModificationException();
		}
		if(this.m_LastRetruned.left !== null && this.m_LastRetruned.right !== null){
			this.m_NextNode = this.m_LastRetruned;
		}
		this.m_rbTree.deleteEntry(this.m_LastRetruned);
		this.m_LastRetruned = null;
		this.expectedModCount = this.map.modCount;
	}

	protected removeDescending(): void {
		if(this.m_LastRetruned === null){
			throw new IllegalStateException();
		}
		if(this.expectedModCount !== this.map.modCount){
			throw new ConcurrentModificationException();
		}
		this.m_rbTree.deleteEntry(this.m_LastRetruned);
		this.m_LastRetruned = null;
		this.expectedModCount = this.map.modCount;
	}
}