import { MapEntry } from "../map";
import { TreeMapEntry } from "./TreeMapEntry";
import { Iterator } from "../iterator";
import { AbstractRedBlackTreeIterator } from "../AbstractRedBlackTreeIterator";
import { RedBlackTreeNode, RedBlackTree } from "../RedBlackTree";

export class TreeMapEntryIterator<K, V> extends AbstractRedBlackTreeIterator<TreeMapEntry<K, V>> implements Iterator<MapEntry<K, V>> {
     constructor(firstNode: RedBlackTreeNode<TreeMapEntry<K, V>>, public rbTree: RedBlackTree<TreeMapEntry<K, V>>){
          super(firstNode, rbTree);
     }

     public next(): TreeMapEntry<K, V> {
          let node = this.nextNode();
          return RedBlackTree.entryOrNull(node);
     }
}
