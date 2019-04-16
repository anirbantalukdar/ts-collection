import { Iterator } from "./iterator";
import { RedBlackTree, RedBlackTreeNode } from "./RedBlackTree";
import { NullPointerException } from "../lang/nullpointerexception";
import { ConcurrentModificationException } from "./concurrentmodificationexception";
import { IllegalStateException } from "../lang/illegalstateexception";

export class AbstractRedBlackTreeIterator<V> implements Iterator<V> {
	protected m_NextNode: RedBlackTreeNode<V> = null;
	protected m_LastRetruned : RedBlackTreeNode<V> = null;
	protected m_ExpectedModCount: number = 0;

	constructor(firstNode: RedBlackTreeNode<V>,  protected rbTree: RedBlackTree<V>){
		this.m_NextNode = firstNode;
		this.m_ExpectedModCount = rbTree.modCount;
		this.m_LastRetruned = null;
	}

	public hasNext(): boolean {
		return this.m_NextNode !== null;
	}

	public next(): V | any {
		return null;
	}

	protected nextNode(): RedBlackTreeNode<V> {
		let e = this.m_NextNode;
		if(e === null){
			throw new NullPointerException();
		}
		if(this.rbTree.modCount !== this.m_ExpectedModCount){
			throw new ConcurrentModificationException();
		}
		this.m_NextNode = this.rbTree.successor(e);
		this.m_LastRetruned = e;
		return e;
	}

	protected prevNode(): RedBlackTreeNode<V>{
		let e = this.m_NextNode;
		if(e === null){
			throw new NullPointerException();
		}
		if(this.rbTree.modCount !== this.m_ExpectedModCount){
			throw new ConcurrentModificationException();
		}
		this.m_NextNode = this.rbTree.predecessor(e);
		this.m_LastRetruned = e;
		return e;
	}

	public remove(): void {
		if(this.m_LastRetruned === null){
			throw new IllegalStateException();
		}
		if(this.rbTree.modCount !== this.m_ExpectedModCount){
			throw new ConcurrentModificationException();
		}
		if(this.m_LastRetruned.left !== null && this.m_LastRetruned.right !== null){
			this.m_NextNode = this.m_LastRetruned;
		}
		this.rbTree.deleteEntry(this.m_LastRetruned);
		this.m_ExpectedModCount = this.rbTree.modCount;
		this.m_LastRetruned = null;
	}

}