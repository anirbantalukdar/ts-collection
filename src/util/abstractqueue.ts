import { Queue } from "./queue";
import { AbstractCollection } from "./abstractcollection";
import { IllegalStateException } from "../lang/illegalstateexception";
import { NoSuchElementException } from "./nosuchelementexception";
import { Collection } from "./collection";
import { NullPointerException } from "../lang/nullpointerexception";
import { IllegalArgumentException } from "../lang/illegalargumentexception";

export abstract class AbstractQueue<E> extends AbstractCollection<E> implements Queue<E> {
     protected constructor(){
          super();
     }

     public abstract offer(e: E): boolean;
     public abstract poll(): E;
     public abstract peek(): E;
     
     public enqueue(e: E): boolean{
          if(this.offer(e)){
               return true;
          }else {
               throw new IllegalStateException('queue full');
          }
     }

     public dequeue(): E{
          let x: E = this.poll();
          if(x !== null){
               return x;
          }else {
               throw new NoSuchElementException();
          }
     }

     public element(): E {
          let x: E = this.peek();
          if(x !== null){
               return x;
          }else {
               throw new NoSuchElementException();
          }
     }

     public clear(): void {
          while(this.poll() !== null);
     }

     public addAll(c: Collection<E>): boolean {
          if(c === null){
               throw new NullPointerException();
          }
          if(c === this){
               throw new IllegalArgumentException();
          }
          let modified = false;
          let itr = c.iterator();
          while(itr.hasNext()){
               this.enqueue(itr.next());
               modified = true;
          }
          return modified;
     }
}