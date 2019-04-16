import { Iterator } from "../iterator";
import { TreeMap } from "../treemap";
import { TreeMapEntry } from "./TreeMapEntry";
import { RedBlackTree, RedBlackTreeNode } from "../RedBlackTree";
import { AbstractRedBlackTreeIterator } from "../AbstractRedBlackTreeIterator";

export class TreeMapKeyIterator<K, V> extends AbstractRedBlackTreeIterator<TreeMapEntry<K, V>> implements Iterator<K> {
     constructor(first: RedBlackTreeNode<TreeMapEntry<K, V>>, public rbTree: RedBlackTree<TreeMapEntry<K, V>>){
          super(first, rbTree);
     }

     public next(): K {
          let node = this.nextNode();
          let entry = RedBlackTree.entryOrNull(node);
          return TreeMap.keyOrNull(entry);
     }
}
