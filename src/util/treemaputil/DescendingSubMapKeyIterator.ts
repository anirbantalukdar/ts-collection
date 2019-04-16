import { SubMapIterator } from "./SubMapIterator";
import { TreeMap } from "../treemap";
import { Iterator } from "../iterator";
import { TreeMapEntry } from "../treemaputil/TreeMapEntry";
import { UnsupportedOperationException } from "../../lang/unsupportedoperationexception";

export class DescendingSubMapKeyIterator<K,V> extends SubMapIterator<K, V> implements Iterator<K>{
	public constructor(map: TreeMap<K, V>, last: TreeMapEntry<K, V>, fence: TreeMapEntry<K, V>){
		super(map, null, null);
			//map.m_RedBlackTree.getRedBlackTreeNode(last), 
			//map.m_RedBlackTree.getRedBlackTreeNode(fence));
		throw new UnsupportedOperationException('This needs to be checked');
	}

	public next(): K | any{
		return this.prevEntry().key;
	}

	public remove(): void {
		this.removeDescending();
	}
}