import { Queue } from "./queue";
import { Iterator } from "./iterator";

export interface Deque<E> extends Queue<E> {
	addFirst(e: E): void;
	addLast(e: E): void;
	offerFirst(e: E): void;
	offerLast(e: E): void;
	pollFirst(): E;
	pollLast(): E;
	getFirst(): E;
	getLast(): E;
	peekFirst(): E;
	peekLast(): E;
	removeFirstOccurance(e: E): boolean;
	removeLastOccurance(e: E): boolean;
	add(e: E): boolean;
	offer(e: E): boolean;
	poll(): E;
	element(): E;
	peek(): E;
	push(e: E): void;
	pop(): E;
	remove(e: E): boolean;
	contains(e: E): boolean;
	size(): number;
	iterator(): Iterator<E>;
	descendingIterator(): Iterator<E>;
}