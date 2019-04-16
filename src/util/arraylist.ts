import { AbstractList } from "./abstractlist";
import { List } from "./list";
import { Comparator } from "./comparator";
import { Collection } from "./collection";

export class ArrayList<E> extends AbstractList<E> implements List<E>{
     private m_Elements: Array<E> = new Array<E>();

     constructor()
     constructor(c ?: Collection<E>){
          super();
          if(c !== undefined){
               //TODO to be converted to c.toArray()
               let cItr = c.iterator();
               while(cItr.hasNext()){
                    this.add(cItr.next());
               }
          }
     }

     public size(): number {
          return this.m_Elements.length;
     }

     public isEmpty(): boolean {
          return this.m_Elements.length === 0;
     }

     public contains(e: E): boolean {
          return this.indexOf(e) >= 0;
     }

     public indexOf(e: E): number {
          if(e === null){
               for(let i=0; i<this.m_Elements.length; i++){
                    if(this.m_Elements[i] === null){
                         return i;
                    }
               }
          }else {
               for(let i=0; i<this.m_Elements.length; i++){
                    let eAny = e as any;
                    if(eAny.equals(this.m_Elements[i])){
                         return i;
                    }
               }
          }
          return -1;
     }

     public lastIndexOf(e: E): number {
          if(e === null){
               for(let i=this.m_Elements.length - 1; i >= 0; i--){
                    if(this.m_Elements[i] === null){
                         return i;
                    }
               }
          }else {
               let eAny = e as any;
               for(let i=this.m_Elements.length - 1; i >= 0; i--){
                    if(eAny.equals(this.m_Elements[i])){
                         return i;
                    }
               }
          }
          return -1;
     }

     public get(index: number): E {
          this.rangeCheck(index);
          return this.m_Elements[index];
     }

     public setAt(index: number, e: E): E{
          this.rangeCheck(index);
          let oldValue = this.m_Elements[index];
          this.m_Elements[index] = e;
          return oldValue;
     }

     public add(value: E):boolean{
          this.m_Elements.push(value);
          return true;
     }

     public addAt(index: number, e: E): void{
          this.rangeCheckForAdd(index);
          this.m_Elements.splice(index, 0, e);
     }

     public remove(e: E): boolean {
          let index = this.indexOf(e);
          if(index < 0){
               return false;
          }
          this.m_Elements.splice(index, 1)
     }

     public removeAt(index: number): E {
          this.rangeCheck(index);
          let e = this.m_Elements[index];
          this.m_Elements.splice(index, 1);
          return e;
     }

     public sort(cmp: Comparator<E>): void {
          this.m_Elements.sort(cmp.compare);
     }

     public clear(){
          this.m_Elements = new Array<E>();
     }
}