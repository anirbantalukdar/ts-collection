import { SubSetIterator } from "./SubSetIterator";
import { TreeSet } from "../TreeSet";

export class AscendingSubSetIterator<E> extends SubSetIterator<E> {
	public constructor(protected treeSet: TreeSet<E>, firstEntry: E, fence: E){
		super(treeSet, firstEntry, fence);
	}

	public next(): E {
		return this.nextEntry();
	}

	public remove(): void{
		this.removeAscending();
	}
}