import { Collection } from "./collection";
import { Iterator } from "./iterator";
import { UnsupportedOperationException } from "../lang/unsupportedoperationexception";
import { NullPointerException } from "../lang/nullpointerexception";
import { IllegalArgumentException } from "../lang/illegalargumentexception";

export abstract class AbstractCollection<E> implements Collection<E> {
     protected constructor(){

     }

     public abstract iterator(): Iterator<E>;
     public abstract size(): number;

     public isEmpty(): boolean{
          return this.size() === 0;
     }

     public contains(e: E): boolean {
          let it : Iterator<E> = this.iterator();
          let eAny: any = e;
          if(eAny.equals !== undefined){
               while(it.hasNext()){
                    if(eAny.equals(it.next())){
                         return true;
                    }
               }
          }else {
               while(it.hasNext()){
                    if(e === it.next()){
                         return true;
                    }
               }
          }
          return false;
     }

     public toArray(): Array<E> {
          let arr = [];
          let itr = this.iterator();
          while(itr.hasNext()){
               arr.push(itr.next());
          }
          return arr;
     }

     public add(e: E):boolean{
          throw new UnsupportedOperationException();
     }

     public remove(e: E):boolean {
          let it = this.iterator();
          let eAny = e as any;
          if(eAny.equals !== undefined){
               while(it.hasNext()){
                    if(eAny.equals(it.next())){
                         it.remove();
                         return true;
                    }
               }
          }else {
               while(it.hasNext()){
                    if(eAny === it.next()){
                         it.remove();
                         return true;
                    }
               }
          }
          return false;
     }

     public containsAll(c: Collection<E>): boolean{
          let it = c.iterator();
          while(it.hasNext()){
               if(!this.contains(it.next())){
                    return false;
               }
          }
          return true;
     }

     public addAll(c: Collection<E>): boolean {
          let modified = false;
          let it = this.iterator();
          while(it.hasNext()){
               modified = modified || this.add(it.next());
          }
          return modified;
     }

     public removeAll(c: Collection<E>){
          if(c === null){
               throw new NullPointerException();
          }
          let modified = false;
          let it = this.iterator();
          while(it.hasNext()){
               if(c.contains(it.next())){
                    it.remove();
                    modified = true;
               }
          }
          return modified;
     }

     public retainAll(c: Collection<E>){
          if(c === null){
               throw new NullPointerException();
          }
          let modified = false;
          let it = this.iterator();
          while(it.hasNext()){
               if(!c.contains(it.next())){
                    it.remove();
                    modified = true;
               }
          }
          return modified;
     }

     public clear(): void{
          let it = this.iterator();
          while(it.hasNext()){
               it.next();
               it.remove();
          }
     }

     protected checkForObjectCompatiability(o: any){
          if(typeof o.equals !== 'function'){
               throw new IllegalArgumentException();
          }
     }
}