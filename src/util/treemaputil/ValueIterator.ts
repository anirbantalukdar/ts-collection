import { Iterator } from "../iterator";
import { TreeMapEntry } from "./TreeMapEntry";
import { RedBlackTreeNode, RedBlackTree } from "../RedBlackTree";
import { AbstractRedBlackTreeIterator } from "../AbstractRedBlackTreeIterator";

export class TreeMapValueIterator<K, V> extends AbstractRedBlackTreeIterator<TreeMapEntry<K, V>> implements Iterator<V> {
     constructor(first: RedBlackTreeNode<TreeMapEntry<K, V>>, public rbTree: RedBlackTree<TreeMapEntry<K, V>>){
          super(first, rbTree);
     }

     public next(): V {
          let node = this.nextNode();
          let entry = RedBlackTree.entryOrNull(node);
          return entry.getValue();
     }
}