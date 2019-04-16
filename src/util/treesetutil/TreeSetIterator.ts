import { AbstractRedBlackTreeIterator } from "../AbstractRedBlackTreeIterator";
import { Iterator } from "../iterator";
import { TreeSet } from "../TreeSet";
import { RedBlackTree } from "../RedBlackTree";

export class TreeSetItetor<E> extends AbstractRedBlackTreeIterator<E> implements Iterator<E> {
	constructor(treeSet: TreeSet<E>){
		super( treeSet.m_RBTree.getFirstNode(), treeSet.m_RBTree);
	}

	public next(): E {
		let node = this.nextNode();
		return RedBlackTree.entryOrNull(node);
	}
}

export class DescendingTreeSetIterator<E> extends AbstractRedBlackTreeIterator<E> implements Iterator<E> {
	constructor(treeSet: TreeSet<E>){
		super(treeSet.m_RBTree.getLastNode(), treeSet.m_RBTree);
	}

	public next(): E {
		let node = this.prevNode();
		return RedBlackTree.entryOrNull(node);
	}
}