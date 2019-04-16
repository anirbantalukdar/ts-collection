import { SubSetIterator } from "./SubSetIterator";
import { TreeSet } from "../TreeSet";

export class DescendingSubSetIterator<E> extends SubSetIterator<E> {
	public constructor(protected treeSet: TreeSet<E>, firstEntry: E, fence: E){
		super(treeSet, firstEntry, fence);
	}

	public remove(): void {
		this.removeDescending();
	}

	public next(): E {
		return this.nextEntry();
	}
}