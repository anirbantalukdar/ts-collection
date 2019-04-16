import { AbstractCollection } from "../abstractcollection";
import { Iterator } from "../iterator";
import { TreeMapValueIterator } from "./ValueIterator";
import { Objects } from "../objects";
import { RedBlackTree } from "../RedBlackTree";
import { TreeMapEntry } from "./TreeMapEntry";
import { TreeMap } from "../treemap";

export class TreeMapValues<K, V> extends AbstractCollection<V> {
     constructor(private rbTree: RedBlackTree<TreeMapEntry<K, V>>){
          super();
     }

     public iterator(): Iterator<V> {
          return new TreeMapValueIterator(this.rbTree.getFirstNode(), this.rbTree);
     }

     public size(): number {
          return this.rbTree.size();
     }

     public contains(value: V): boolean{
          let node = this.rbTree.getFirstNode();
          while(node !== null){
               let entry = RedBlackTree.entryOrNull(node);
               let v = TreeMap.valueOrNull(entry) as any;
               if(v.equals(value)){
                    return true;
               }
               node = this.rbTree.successor(node);
          }
          return false;
     }

     public remove(value: V): boolean {
          for(let e = this.rbTree.getFirstNode(); e !== null; e = this.rbTree.successor(e)){
               let entry = RedBlackTree.entryOrNull(e);
               let v = entry.getValue();
               if(Objects.equals(v, value)){
                    this.rbTree.deleteEntry(e);
                    return true;
               }
          }
          return false;
     }

     public clear(){
          this.rbTree.clear();
     }
}