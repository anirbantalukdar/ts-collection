import { TreeMap } from "../treemap";
import { TreeMapEntry } from "./TreeMapEntry";
import { Iterator } from "../iterator";
import { RedBlackTree, RedBlackTreeNode } from "../RedBlackTree";
import { AbstractRedBlackTreeIterator } from "../AbstractRedBlackTreeIterator";

export class TreeMapDescendingKeyIterator<K, V> extends AbstractRedBlackTreeIterator<TreeMapEntry<K, V>> implements Iterator<K> {
     constructor(first: RedBlackTreeNode<TreeMapEntry<K, V>>, tree: RedBlackTree<TreeMapEntry<K, V>>){
          super(first, tree);
     }

     public next(): K {
          let node = this.prevNode();
          let entry = RedBlackTree.entryOrNull(node);
          return TreeMap.keyOrNull(entry);
     }
}