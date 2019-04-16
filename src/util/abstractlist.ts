import { AbstractCollection } from "./abstractcollection";
import { List } from "./list";
import { UnsupportedOperationException } from "../lang/unsupportedoperationexception";
import { ListIterator } from "./listiterator";
import { Collection } from "./collection";
import { Iterator } from "./iterator";
import { IndexOutOfBoundsException } from "./indexoutofboundsexception";
import { NoSuchElementException } from "./nosuchelementexception";
import { IllegalStateException } from "../lang/illegalstateexception";
import { ConcurrentModificationException } from "./concurrentmodificationexception";
import { Comparator } from "./comparator";


export abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
     modCount: number = 0;

     protected constructor(){
          super();
     }

     public add(e: E): boolean {
          this.addAt(this.size(), e);
          return true;
     }

     public abstract size():number;
     public abstract get(index: number): E;
     public abstract setAt(index: number, e: E): E;
     public abstract addAt(index: number, e: E): void;
     public abstract removeAt(index: number): E;

     public indexOf(e: E): number {
          let it: ListIterator<E> = this.listIterator();
          while(it.hasNext()){
               if(e === it.next()){
                    return it.previousIndex();
               }
          }
          return -1;
     }

     public lastIndexOf(e: E): number {
          let it: ListIterator<E> = this.listIteratorFrom(this.size());
          while(it.hasPrevious()){
               if(it.previous() === e){
                    return it.nextIndex();
               }
          }
          return -1;
     }

     public clear(): void {
          this.removeRange(0, this.size());
     }

     public addAll(c: Collection<E>): boolean{
          return this.addAllFrom(this.size(), c);
     }

     public addAllFrom(index: number, c: Collection<E>): boolean {
          this.rangeCheckForAdd(index);
          let modified = false;
          let it = c.iterator();
          while(it.hasNext()){
               this.addAt(index++, it.next());
               modified = true;
          }
          return modified;
     }

     public iterator() : Iterator<E>{
          return new Itr(this);
     }

     public listIterator(): ListIterator<E>{
          return this.listIteratorFrom(0);
     }

     public listIteratorFrom(index: number): ListIterator<E> {
          this.rangeCheckForAdd(index);
          return new ListItr(index, this);
     }

     public removeRange(fromIndex: number, toIndex: number){
          let it = this.listIteratorFrom(fromIndex);
          for(let i=0, n = toIndex - fromIndex; i < n;i++){
               it.next();
               it.remove();
          }
     }

     protected rangeCheckForAdd(index: number){
          if(index < 0 || index > this.size()){
               throw new IndexOutOfBoundsException(this.indexOutOfBoundsMsg(index));
          }
     }

     protected indexOutOfBoundsMsg(index: number){
          return 'Index: ' + index + ", Size: " + this.size();
     }

     protected rangeCheck(index: number) {
          if(index < 0 || index >= this.size()){
               throw new IndexOutOfBoundsException(this.indexOutOfBoundsMsg(index));
          }
     }
}

class Itr<E> implements Iterator<E>{
     protected cursor: number = 0;
     protected lastRet: number = -1;
     protected expectedModCount: number;

     public constructor(protected iteratorOf: AbstractList<E>){
          this.expectedModCount = iteratorOf.modCount;
     }

     public hasNext(){
          return this.cursor !== this.iteratorOf.size();
     }

     public next(): E {
          this.checkForModification();
          try{
               let i = this.cursor;
               let next = this.iteratorOf.get(i);
               this.lastRet = i;
               this.cursor = i+1;
               return next;
          }catch(ex){
               if(ex instanceof IndexOutOfBoundsException){
                    this.checkForModification();
                    throw new NoSuchElementException();
               }
          }
     }

     public remove(): void{
          if(this.lastRet < 0){
               throw new IllegalStateException();
          }
          this.checkForModification();
          try {
               this.iteratorOf.removeAt(this.lastRet);
               if(this.lastRet < this.cursor){
                    this.cursor --;
               }
               this.expectedModCount = this.iteratorOf.modCount;
          }catch(ex){
               if(ex instanceof IndexOutOfBoundsException){
                    throw new ConcurrentModificationException();
               }
          }
     }

     protected checkForModification(){
          if(this.expectedModCount != this.iteratorOf.modCount){
               throw new ConcurrentModificationException();
          }
     }
}

class ListItr<E> extends Itr<E> implements ListIterator<E> {
     constructor(index: number, protected iteratorOf: AbstractList<E>){
          super(iteratorOf);
          this.cursor = index;
     }

     public hasPrevious(): boolean {
          return this.cursor !== 0;
     }

     public previous(): E {
          this.checkForModification();
          try{
               let i = this.cursor - 1;
               let previous = this.iteratorOf.get(i);
               this.lastRet = this.cursor = i;
               return previous;
          }catch(ex){
               if(ex instanceof IndexOutOfBoundsException){
                    this.checkForModification();
                    throw new NoSuchElementException();
               }
          }
     }

     public nextIndex(): number{
          return this.cursor;
     }

     public previousIndex(){
          return this.cursor - 1;
     }

     public set(e: E){
          if(this.lastRet < 0){
               throw new IllegalStateException();
          }
          this.checkForModification();

          try{
               this.iteratorOf.setAt(this.lastRet, e);
               this.expectedModCount = this.iteratorOf.modCount;
          }catch(ex){
               if(ex instanceof IndexOutOfBoundsException){
                    throw new ConcurrentModificationException();
               }
          }
     }

     public add(e: E){
          this.checkForModification();
          try{
               let i = this.cursor;
               this.iteratorOf.addAt(i, e);
               this.lastRet = -1;
               this.cursor = i + 1;
          }catch(ex){
               if(ex instanceof IndexOutOfBoundsException){
                    throw new ConcurrentModificationException();
               }
          }
     }
}

