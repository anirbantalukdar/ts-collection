import { AbstractSequentialList } from "./AbstractSequentialList";
import { Collection } from "./collection";
import { NoSuchElementException } from "./nosuchelementexception";
import { List } from "./list";
import { Deque } from "./deque";
import { Objects } from "./objects";
import { IndexOutOfBoundsException } from "./indexoutofboundsexception";
import { ConcurrentModificationException } from "./concurrentmodificationexception";
import { IllegalStateException } from "../lang/illegalstateexception";
import { ListIterator } from "./listiterator";
import { Iterator } from "./iterator";
import { UnsupportedOperationException } from "../lang/unsupportedoperationexception";

class Node<E> {
	constructor(public prev: Node<E>, public element: E, public next: Node<E>) {

	}
}

export class LinkedList<E> extends AbstractSequentialList<E> implements List<E>, Deque<E> {
	m_First: Node<E>;
	m_Last: Node<E>;
	m_Size: 0;
	constructor();
	constructor(c: Collection<E>);
	constructor(c?: Collection<E>) {
		super();
		if (c !== undefined || c !== null) {
			this.addAll(c);
		}
	}

	linkFirst(e: E): void {
		let f = this.m_First;
		let newNode = new Node<E>(null, e, f);
		this.m_First = newNode;
		if (f == null)
			this.m_Last = newNode;
		else
			f.prev = newNode;
		this.m_Size++;
		this.modCount++;
	}

	linkLast(e: E): void {
		let l = this.m_Last;
		let newNode = new Node<E>(l, e, null);
		this.m_Last = newNode;
		if (l == null)
			this.m_First = newNode;
		else
			l.next = newNode;
		this.m_Size++;
		this.modCount++;
	}

	/**
	 * Inserts element e before non-null Node succ.
	 */
	linkBefore(e: E, succ: Node<E>): void {
		let pred = succ.prev;
		let newNode = new Node<E>(pred, e, succ);
		succ.prev = newNode;
		if (pred == null)
			this.m_First = newNode;
		else
			pred.next = newNode;
		this.m_Size++;
		this.modCount++;
	}

	/**
	 * Unlinks non-null first node f.
	 */
	unlinkFirst(f: Node<E>): E {
		// assert f == first && f != null;
		let element = f.element;
		let next = f.next;
		f.element = null;
		f.next = null; // help GC
		this.m_First = next;
		if (next == null)
			this.m_Last = null;
		else
			next.prev = null;
		this.m_Size--;
		this.modCount++;
		return element;
	}

	/**
	 * Unlinks non-null last node l.
	 */
	unlinkLast(l: Node<E>): E {
		// assert l == last && l != null;
		let element = l.element;
		let prev = l.prev;
		l.element = null;
		l.prev = null; // help GC
		this.m_Last = prev;
		if (prev == null)
			this.m_First = null;
		else
			prev.next = null;
		this.m_Size--;
		this.modCount++;
		return element;
	}

	/**
	 * Unlinks non-null node x.
	 */
	unlink(x: Node<E>): E {
		// assert x != null;
		let element = x.element;
		let next = x.next;
		let prev = x.prev;

		if (prev == null) {
			this.m_First = next;
		} else {
			prev.next = next;
			x.prev = null;
		}

		if (next == null) {
			this.m_Last = prev;
		} else {
			next.prev = prev;
			x.next = null;
		}

		x.element = null;
		this.m_Size--;
		this.modCount++;
		return element;
	}

	public enqueue(e: E): boolean {
		throw new UnsupportedOperationException();
	}

	public dequeue(): E {
		throw new UnsupportedOperationException();
	}

	public getFirst(): E {
		let f = this.m_First;
		if(f === null){
			throw new NoSuchElementException();
		}
		return f.element;
	}

	public getLast(): E {
		let l = this.m_Last;
		if(l === null){
			throw new NoSuchElementException();
		}
		return l.element;
	}

	public removeFirst(): E {
		let f = this.m_First;
		if(f === null){
			throw new NoSuchElementException();
		}
		return this.unlinkFirst(f);
	}

	public removeLast(): E {
		let l = this.m_Last;
		if(l === null){
			throw new NoSuchElementException();
		}
		return this.unlinkLast(l);
	}

	public addFirst(e: E): void {
		this.linkFirst(e);
	}

	public addLast(e: E): void {
		this.linkLast(e);
	}

	public contains(e: E): boolean {
		return this.indexOf(e) !== -1;
	}

	public size(): number {
		return this.m_Size;
	}

	public add(e: E): boolean {
		this.linkFirst(e);
		return true;
	}

	public remove(e: E): boolean {
		for(let x = this.m_First; x !== null; x = x.next){
			if(Objects.equals(e, x.element)){
				this.unlink(x);
				return true;
			}
		}
		return false;
	}

	public addAll(c: Collection<E>): boolean {
		return this.addAllFrom(0, c);
	}

	public addAllFrom(index: number, c: Collection<E>): boolean {
		this.checkPositionIndex(index);
		let cSize = c.size();
		if(cSize === 0){
			return false;
		}
		let pred: Node<E> = null;
		let succ: Node<E> = null;
		if(index === this.m_Size){
			succ = null;
			pred = this.m_Last;
		}else {
			succ = this.nodeAt(index);
			pred = succ.prev;	
		}
		let iter = c.iterator();
		while(iter.hasNext()){
			let e = iter.next();
			let newNode = new Node(pred, e, null);
			if(pred === null){
				this.m_First = newNode; 
			}else {
				pred.next = newNode;
			}
		}
		if(succ === null){
			this.m_Last = pred;
		}else {
			pred.next = succ;
			succ.prev = pred;
		}
		this.m_Size += cSize;
		this.modCount ++;
		return true;
	}

	public clear(): void {
		for(let x = this.m_First; x !== null; ){
			let next = x.next;
			x.element =null;
			x.next = null;
			x.prev = null;
			x = next;
		}
		this.m_First = this.m_Last = null;
		this.m_Size = 0;
		this.modCount = 0;
	}

	public get(index: number): E {
		this.checkElementIndex(index);
		return this.nodeAt(index).element;
	}

	public setAt(index: number, element: E): E {
		this.checkElementIndex(index);
		let x = this.nodeAt(index);
		let oldVal = x.element;
		x.element = element;
		return oldVal;
	}

	public addAt(index: number, element: E):void {
		this.checkPositionIndex(index);
		if(index === this.m_Size){
			this.linkLast(element);
		}else {
			this.linkBefore(element, this.nodeAt(index));
		}
	}

	public removeAt(index: number): E {
		this.checkElementIndex(index);
		return this.unlink(this.nodeAt(index));
	}

	private checkElementIndex(index: number): void {
		if(this.isElementIndex(index)){

		}
	}

	private isElementIndex(index: number): boolean {
		return index >= 0 && index < this.m_Size;
	}

	private isPositionIndex(index: number): boolean {
		return index > 0 && index <= this.m_Size;
	}

	private outOfBoundsMsg(index: number) {
		return 'Index: ' + index + ", Size: " + this.m_Size;
	}
	private checkPositionIndex(index: number){
		if(!this.isPositionIndex(index)){
			throw new IndexOutOfBoundsException(this.outOfBoundsMsg(index));
		}
	}

	nodeAt(index: Number): Node<E> {
		if(index < (this.m_Size >> 1)){
			let x = this.m_First;
			for(let i=0; i<index; i++){
				x = x.next;
			}
			return x;
		}else {
			let x = this.m_Last;
			for(let i=this.m_Size - 1; i > index; i--){
				x = x.prev;
			}
			return x;
		}
	}

	public indexOf(e: E): number {
		let index = 0;
		for(let x = this.m_First; x !== null; x = x.next){
			if(Objects.equals(e, x.element)){
				return index;
			}
			index ++;
		}
		return -1;
	}

	public lastIndexOf(e: E): number {
		let index = 0;
		for(let x = this.m_Last; x !== null; x = x.prev){
			if(Objects.equals(e, x.element)){
				return index;
			}
			index ++;
		}
		return -1;
	}

	public peek(): E {
		let f = this.m_First;
		return (f === null) ? null : f.element;
	}

	public element(): E {
		return this.getFirst();
	}

	public poll(): E {
		let f = this.m_First;
		return f === null ? null : this.unlinkFirst(f);
	}

	public offer(e: E): boolean {
		return this.add(e);
	}

	public offerFirst(e: E): boolean {
		this.addFirst(e);
		return true;
	}

	public offerLast(e: E): boolean {
		this.addLast(e);
		return true;
	}

	public peekFirst(): E {
		let f = this.m_First;
		return f === null ? null : f.element;
	}

	public peekLast(): E {
		let f = this.m_Last;
		return f === null ? null : f.element;
	}

	public pollFirst(): E {
		let f = this.m_First;
		return f === null ? null : this.unlinkFirst(f);
	}

	public pollLast(): E {
		let l = this.m_Last;
		return l === null ? null : this.unlinkLast(l);
	}

	public push(e: E): void {
		this.addFirst(e);
	}

	public pop(): E {
		return this.removeFirst();
	}

	public removeFirstOccurance(e: E) {
		return this.remove(e);
	}

	public removeLastOccurance(e: E): boolean {
		for(let x = this.m_Last; x !== null; x = x.prev){
			if(Objects.equals(e, x.element)){
				this.unlink(x);
				return true;
			}
		}
		return false;
	}

	public listIteratorFrom(index: number): ListIterator<E> {
		this.checkPositionIndex(index);
		return new ListItr(this, index);
	}

	public descendingIterator(): Iterator<E> {
		return new DescendingIterator(this);
	}
}

class ListItr<E> implements ListIterator<E>{
	private m_LastRetruned : Node<E>;
	private m_Next : Node<E>;
	private m_NextIndex : number;
	private m_ExpectedModeCount : number;

	constructor(protected linkedList: LinkedList<E>, index: number){
		this.m_Next = (index === linkedList.size()) ? null : linkedList.nodeAt(index);
		this.m_NextIndex = index;
		this.m_ExpectedModeCount = linkedList.modCount;
	}

	public hasNext(): boolean {
		return this.m_NextIndex < this.linkedList.size();
	}

	public next(): E {
		this.checkForComodification();
		if(!this.hasNext()){
			throw new NoSuchElementException();
		}
		this.m_LastRetruned = this.m_Next;
		this.m_Next = this.m_Next.next;
		this.m_NextIndex ++;
		return this.m_LastRetruned.element;
	}

	public hasPrevious(): boolean {
		return this.m_NextIndex > 0;
	}

	public previous(): E {
		this.checkForComodification();
		if(!this.hasPrevious()){
			throw new NoSuchElementException();
		}
		this.m_LastRetruned = this.m_Next = (this.m_Next === null) ? this.linkedList.m_Last : this.m_Next.prev;
		this.m_NextIndex --;
		return this.m_LastRetruned.element;
	}

	public nextIndex(): number {
		return this.m_NextIndex;
	}

	public previousIndex(): number {
		return this.m_NextIndex - 1;
	}

	public remove(): void {
		this.checkForComodification();
		if(this.m_LastRetruned === null){
			throw new IllegalStateException();
		}
		let lastNext = this.m_LastRetruned.next;
		this.linkedList.unlink(this.m_LastRetruned);
		if(this.m_Next === this.m_LastRetruned){
			this.m_Next = lastNext;
		}else {
			this.m_NextIndex --;
		}
		this.m_LastRetruned = null;
		this.m_ExpectedModeCount ++;
	}

	public set(e: E): void {
		if(this.m_LastRetruned === null){
			throw new IllegalStateException();
		}
		this.checkForComodification();
		this.m_LastRetruned.element = e;
	}

	public add(e: E): void {
		this.checkForComodification();
		this.m_LastRetruned = null;
		if(this.m_Next === null){
			this.linkedList.linkLast(e);
		}else {
			this.linkedList.linkBefore(e, this.m_Next);
		}
		this.m_NextIndex++;
		this.m_ExpectedModeCount ++;
	}

	private checkForComodification(){
		if(this.linkedList.modCount !== this.m_ExpectedModeCount){
			throw new ConcurrentModificationException();
		}
	}
}

class DescendingIterator<E> implements Iterator<E> {
	private listItr : ListItr<E>;
	constructor(linkedList: LinkedList<E>){
		this.listItr = new ListItr(linkedList, linkedList.size());
	}

	public hasNext(): boolean {
		return this.listItr.hasPrevious();
	}

	public next(): E {
		return this.listItr.previous();
	}

	public remove(): void {
		this.listItr.remove();
	}
}