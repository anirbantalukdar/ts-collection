import { Iterator } from "../iterator";
import { TreeSet } from "../TreeSet";
import { RedBlackTree, RedBlackTreeNode } from "../RedBlackTree";
import { NoSuchElementException } from "../nosuchelementexception";
import { ConcurrentModificationException } from "../concurrentmodificationexception";
import { IllegalStateException } from "../../lang/illegalstateexception";

export abstract class SubSetIterator<E> implements Iterator<E> {
	protected m_RBTree: RedBlackTree<E> = null;
	protected m_LastRetruned: RedBlackTreeNode<E> = null;
	protected m_NextNode : RedBlackTreeNode<E> = null;
	protected m_FenceNode: RedBlackTreeNode<E> = null;
	protected expectedModCount: number = 0;

	public constructor(protected treeSet: TreeSet<E>, firstEntry: E, fence: E){
		this.m_RBTree = treeSet.m_RBTree;
		this.expectedModCount = this.m_RBTree.modCount;
		this.m_LastRetruned = null;
		this.m_FenceNode = null;
		if(fence !== null){
			this.m_FenceNode = this.m_RBTree.getRedBlackTreeNode(fence);
		}
		this.m_NextNode = this.m_RBTree.getRedBlackTreeNode(firstEntry);
	}

	protected isBounded(): boolean {
		return this.m_FenceNode !== null;
	}

	public hasNext(): boolean {
		return this.m_NextNode !== null && this.m_NextNode !== this.m_FenceNode;
	}

	protected nextEntry(): E {
		let e = this.m_NextNode;
		if(e === null || e === this.m_FenceNode){
			throw new NoSuchElementException();
		}
		if(this.m_RBTree.modCount !== this.expectedModCount){
			throw new ConcurrentModificationException();
		}
		this.m_NextNode = this.m_RBTree.successor(e);
		this.m_LastRetruned = e;
		return RedBlackTree.entryOrNull(e);
	}

	protected prevEntry(): E {
		let e = this.m_NextNode;
		if(e === null || e === this.m_FenceNode){
			throw new NoSuchElementException();
		}
		if(this.m_RBTree.modCount !== this.expectedModCount){
			throw new ConcurrentModificationException();
		}
		this.m_NextNode = this.m_RBTree.predecessor(e);
		this.m_LastRetruned = e;
		return RedBlackTree.entryOrNull(e);
	}

	protected removeAscending(){
		if(this.m_LastRetruned === null){
			throw new IllegalStateException();
		}
		if(this.expectedModCount !== this.m_RBTree.modCount){
			throw new ConcurrentModificationException();
		}
		if(this.m_LastRetruned.left !== null && this.m_LastRetruned.right !== null){
			this.m_NextNode = this.m_LastRetruned;
		}
		this.m_RBTree.deleteEntry(this.m_LastRetruned);
		this.m_LastRetruned = null;
		this.expectedModCount = this.m_RBTree.modCount;
	}

	protected removeDescending(){
		if(this.m_LastRetruned === null){
			throw new IllegalStateException();
		}
		if(this.m_RBTree.modCount !== this.expectedModCount){
			throw new ConcurrentModificationException();
		}
		this.m_RBTree.deleteEntry(this.m_LastRetruned);
		this.expectedModCount = this.m_RBTree.modCount;
	}

	public abstract next(): E;
	public abstract remove(): void;
}