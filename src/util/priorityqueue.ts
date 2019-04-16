import { AbstractQueue } from "./abstractqueue";
import { Comparator, isComparator } from "./comparator";
import { Collection, isCollection } from "./collection";
import { NullPointerException } from "../lang/nullpointerexception";
import { Iterator } from "./iterator";
import { ConcurrentModificationException } from "./concurrentmodificationexception";
import { NoSuchElementException } from "./nosuchelementexception";
import { SortedSet, isSortedSet } from "./sortedset";
import { Comparable } from "./comparable";
import { Objects } from "./objects";

export class PriorityQueue<E> extends AbstractQueue<E> {
     m_Elements: Array<E> = new Array<E>();
     
     m_Comparator: Comparator<E> = null;
     modCount: number = 0;

     constructor(cmpOrCollection ?: Comparator<E> | Collection<E>){
          super();
          
          this.m_Elements = new Array<E>();
          this.m_Comparator = null;
          if(isComparator<E>(cmpOrCollection)){
               this.m_Comparator = cmpOrCollection;
          }else if(isCollection<E>(cmpOrCollection)){
               let collection : Collection<E> = cmpOrCollection;
               if(isSortedSet<E>(collection)){
                    let sortedSet : SortedSet<E> = collection;
                    this.m_Comparator = sortedSet.comparator();
                    this.initElementsFromSortedSet(sortedSet);
               }else if(collection instanceof PriorityQueue){
                    let pq : PriorityQueue<E> = collection as PriorityQueue<E>;
                    this.m_Comparator = pq.comparator();
                    this.initFromPriorityQueue(pq);
               }else {
                    this.m_Comparator =null;
                    this.initFromCollection(collection);
               }
          }
          this.modCount = 0;
     }

     private initFromPriorityQueue(pq: PriorityQueue<E>) {
          this.m_Comparator = pq.comparator();
          for(let i=0; i<pq.m_Elements.length; i++){
               this.m_Elements.push(pq.m_Elements[i]);
          }
     }

     private initElementsFromSortedSet(ss: SortedSet<E>): void {
          let comparator = this.comparator();
          if(ss.size() === 1 || comparator !== null){
               let itr = ss.iterator();
               while(itr.hasNext()){
                    let ssElem = itr.next();
                    if(ssElem === null){
                         throw new NullPointerException();
                    }
               }
          }
          let itr = ss.iterator();
          while(itr.hasNext()){
               this.m_Elements.push(itr.next());
          }
     }

     private initFromCollection(c: Collection<E>): void {
          let itr = c.iterator();
          while(itr.hasNext()){
               this.m_Elements.push(itr.next());
          }
          this.buildHeap();
     }

     public comparator(): Comparator<E> {
          return this.m_Comparator;
     }

     public add(e: E): boolean {
          return this.offer(e);
     }

     public offer(e: E): boolean {
          if(e === null){
               throw new NullPointerException();
          }
          this.modCount ++;
          this.m_Elements.push(e);
          let length = this.m_Elements.length;
          if(length > 1){
               this.heapifyPath(length - 1);
          }
          return true;
     }

     public peek(): E {
          if(this.m_Elements.length === 0){
               return null;
          }
          return this.m_Elements[0];
     }

     private indexOf(e: E){
          for(let i=0; i<this.m_Elements.length; i++){
               if(Objects.equals(e, this.m_Elements[i])){
                    return i;
               }
          }
          return -1;
     }

     public remove(o: any):boolean{
          let i = this.indexOf(o);
          if(i === -1){
               return false;
          }
          this.removeAt(i);
          return true;
     }

     public contains(o: any){
          return this.indexOf(o) !== -1;
     }

     public clear() {
          this.m_Elements = new Array<E>();
          this.modCount ++;
     }

     public size(): number {
          return this.m_Elements.length;
     }


     public poll(): E {
          if(this.m_Elements.length === 0){
               return null;
          }
          return this.removeAt(0);
     }

     public iterator(): Itr<E> {
          return new Itr(this);
     }
     
     removeAt(index: number): E {
          if(index < 0 || index >= this.m_Elements.length){
               throw new NoSuchElementException();
          }
          this.modCount ++;
          if(this.m_Elements.length - 1 === index){
               let e = this.m_Elements[this.m_Elements.length - 1];
               this.m_Elements.splice(this.m_Elements.length - 1, 1);
               return e;
          }else {
               let e = this.m_Elements[index];
               this.m_Elements[index] = this.m_Elements[this.m_Elements.length - 1];
               this.m_Elements.splice(this.m_Elements.length-1, 1);
               this.heapify(index);
               return e;
          }
     }

     private parent(index: number): number {
          return Math.floor(index/2);
     }

     private left(index: number): number {
          return 2*index + 1;
     }

     private right(index: number): number {
          return 2*index + 2;
     }

     private compare(e1: E, e2: E): number {
          if(this.m_Comparator !== null){
               return this.m_Comparator.compare(e1, e2);
          }
          let ec1 = <any>e1 as Comparable<E>;
		return ec1.compareTo(e2);
     }

     private heapifyPath(index: number): void {
          if(index < 1  || index > this.m_Elements.length - 1){
               return;
          }
          let p = this.parent(index);
          while(index > 0){
               let cmp = this.compare(this.m_Elements[p], this.m_Elements[index]);
               if(cmp > 0){
                    this.swap(index, p);
               }
               index = p;
               p = this.parent(p);
          }
     }

     private swap(i1: number, i2: number): void {
          let tmp = this.m_Elements[i1];
          this.m_Elements[i1] = this.m_Elements[i2];
          this.m_Elements[i2] = tmp;
     }

     private heapify(index: number): void{
          if(index < 0 || index >= this.m_Elements.length){
               return;
          }
          let l = this.left(index);
          let r = this.right(index);
          let largest = index;
          if(l < this.m_Elements.length && this.compare(this.m_Elements[largest], this.m_Elements[l]) > 0){
              largest = l; 
          }
          if(r < this.m_Elements.length && this.compare(this.m_Elements[largest], this.m_Elements[r]) > 0){
               largest = r;
          }
          if(largest !== index){
               this.swap(index, largest);
               this.heapify(largest);
          }
     }

     private buildHeap(){
          let index = Math.floor(this.m_Elements.length/2);
          for(let i=index; i > 0; i--){
               this.heapify(i);
          }
     }
}

export class Itr<E> implements Iterator<E>{
     private cursor: number = 0;
     private lastRet: number = -1;
     private expectedModCount: number;
     public constructor(private iteratorOf: PriorityQueue<E>){
          this.expectedModCount = iteratorOf.modCount;
     }

     public hasNext(): boolean {
          if(this.cursor < this.iteratorOf.size()){
               return true;
          }
          return false;
     }

     public next(): E {
          if(this.expectedModCount !== this.iteratorOf.modCount){
               throw new ConcurrentModificationException();
          }
          if(this.cursor < this.iteratorOf.size()){
               this.lastRet = this.cursor;
               let e = this.iteratorOf.m_Elements[this.lastRet];
               this.cursor++;
               return e;
          }
          throw new NoSuchElementException();
     }

     public remove(): void {
          if(this.expectedModCount !== this.iteratorOf.modCount){
               throw new ConcurrentModificationException();
          }
          if(this.lastRet !== -1){
               let e = this.iteratorOf.removeAt(this.lastRet);

          }
     }
}