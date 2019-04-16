import { AbstractSet } from "../abstractset";
import { MapEntry } from "../map";
import { Iterator } from "../iterator";
import { TreeMapEntryIterator } from "./TreeMapMapEntryIterator";
import { Objects } from "../objects";
import { RedBlackTree } from "../RedBlackTree";
import { TreeMapEntry } from "./TreeMapEntry";

export class TreeMapEntrySet<K, V> extends AbstractSet<MapEntry<K, V>> {
     public constructor(private rbTree: RedBlackTree<TreeMapEntry<K, V>>){
          super();
     }

     public iterator(): Iterator<MapEntry<K, V>> {
          return new TreeMapEntryIterator<K, V>(this.rbTree.getFirstNode(), this.rbTree);
     }

     public contains(e: MapEntry<K, V>): boolean {
          let treeMapEntry = e as TreeMapEntry<K, V>;
          let p = this.rbTree.getRedBlackTreeNode(treeMapEntry);
          let entry = RedBlackTree.entryOrNull(p);
          return entry !== null && Objects.equals(e.getValue(), entry.getValue());
     }

     public remove(e: MapEntry<K, V>): boolean {
          let treeMapEntry = e as TreeMapEntry<K, V>;
          let node = this.rbTree.getRedBlackTreeNode(treeMapEntry);
          let entry = RedBlackTree.entryOrNull(node);
          if(entry !== null && Objects.equals(e.getValue(), entry.getValue())){
               this.rbTree.deleteEntry(node);
               return true;
          }
          return false;
     }

     public size(): number {
          return this.rbTree.size();
     }

     public clear(): void {
          this.rbTree.clear();
     }
}