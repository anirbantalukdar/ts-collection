import { AbstractMap, ImmutableMapEntry } from "./abstractmap";
import { NavigableMap } from "./navigablemap";
import { Comparator, isComparator } from "./comparator";
import { MapEntry, Map, isMap } from "./map";
import { SortedMap } from "./sortedmap";
import { Comparable } from "./comparable";
import { NavigableSet } from "./navigableset";
import { Set } from "./set";
import { Iterator } from "./iterator";
import { Collection } from "./collection";
import { TreeMapKeyIterator } from "./treemaputil/TreeMapKeyIterator";
import { TreeMapDescendingKeyIterator } from "./treemaputil/TreeMapDescendingKeyIterator";
import { TreeMapKeySet } from "./treemaputil/TreeMapKeySet";
import { Objects } from "./objects";
import { TreeMapValues } from "./treemaputil/TreeMapValues";
import { TreeMapEntrySet } from "./treemaputil/TreeMapEntrySet";
import { TreeMapEntry } from "./treemaputil/TreeMapEntry";
import { RedBlackTree } from "./RedBlackTree";
import { DescendingSubMap } from "./treemaputil/DescendingSubMap";

class TreeMapEntryComparator<K, V> implements Comparator<TreeMapEntry<K,V>> {
     constructor(private comparator: Comparator<K>){
          
     }
     public compare(entry1: TreeMapEntry<K, V>, entry2: TreeMapEntry<K, V>):number {
          if(this.comparator !== null){
               return this.comparator.compare(entry1.getKey(), entry2.getKey());
          }
          let k1 = <any>entry1.getKey() as Comparable<K>;
          return k1.compareTo(entry2.getKey());
     }
}

export class TreeMap<K, V> extends AbstractMap<K, V> implements NavigableMap<K, V> {
     m_Comparator: Comparator<K>;
     m_RedBlackTree: RedBlackTree<TreeMapEntry<K, V>>;

     constructor(param ?: Map<K, V> | Comparator<K>){
          super();
          let comparator = null;
          if(isComparator(param)){
               comparator = new TreeMapEntryComparator<K, V>(param);
          }
          this.m_Comparator = comparator;
          this.m_RedBlackTree = new RedBlackTree<TreeMapEntry<K, V>>(comparator);
          if(isMap(param)){
               this.putAll(param);
          }
     }

     
     public get modCount() : number {
          return this.m_RedBlackTree.modCount;
     }

     public size(): number {
          return this.m_RedBlackTree.size();
     }

     public containsKey(key: K): boolean {
          let entry = new TreeMapEntry(key, null);
          return this.m_RedBlackTree.getRedBlackTreeNode(entry) !== null;
     }

     public containsValue(value: V): boolean {
          let entry = this.m_RedBlackTree.getFirstNode();;
          while(entry !== null){
               if(Objects.equals(value, entry.value)){
                    return true;
               }
               entry = this.m_RedBlackTree.successor(entry);
          }
     }

     public get(key: K): V {
          let node = this.m_RedBlackTree.getRedBlackTreeNode(new TreeMapEntry<K, V>(key, null));
          let entry = RedBlackTree.entryOrNull(node);
          return TreeMap.valueOrNull(entry);
     }

     public comparator(): Comparator<K> {
          return this.m_Comparator
     }

     public firstKey(): K {
          let firstNode = this.m_RedBlackTree.getFirstNode();
          return TreeMap.keyOrNull(RedBlackTree.entryOrNull(firstNode))
     }

     public lastKey(): K {
          let lastNode = this.m_RedBlackTree.getLastNode();
          return TreeMap.keyOrNull(RedBlackTree.entryOrNull(lastNode))
     }

     public put(key: K, value: V): V {
          let result = this.m_RedBlackTree.put(new TreeMapEntry<K, V>(key, value));
          return result.value;
     }

     public remove(key: K): V {
          let entry = this.m_RedBlackTree.remove(new TreeMapEntry<K, V>(key, null));
          return TreeMap.valueOrNull(entry);
     }

     public clear(){
          this.m_RedBlackTree.clear();
     }

     public firstEntry(): MapEntry<K, V> {
          let node = this.m_RedBlackTree.getFirstNode();
          return RedBlackTree.entryOrNull(node);
     }

     public lastEntry(): MapEntry<K,V> {
          let node = this.m_RedBlackTree.getLastNode();
          return RedBlackTree.entryOrNull(node);
     }

     public pollFirstEntry(): MapEntry<K, V> {
          let node = this.m_RedBlackTree.getFirstNode();
          let result = this.exportEntry(RedBlackTree.entryOrNull(node));
          if(node !== null){
               this.m_RedBlackTree.deleteEntry(node);
          }
          return result;
     }

     public pollLastEntry(): MapEntry<K, V> {
          let node = this.m_RedBlackTree.getLastNode();
          let result = this.exportEntry(RedBlackTree.entryOrNull(node));
          if(node !== null){
               this.m_RedBlackTree.deleteEntry(node);
          }
          return result;
     }

     public lowerEntry(key: K): MapEntry<K,V> {
          let node = this.m_RedBlackTree.getLowerNode(new TreeMapEntry<K, V>(key, null));
          return this.exportEntry(RedBlackTree.entryOrNull(node));
     }

     public lowerKey(key: K): K{
          return TreeMap.keyOrNull(this.lowerEntry(key));
     }

     public floorEntry(key: K): MapEntry<K, V> {
          let node = this.m_RedBlackTree.getFloorNode(new TreeMapEntry<K, V>(key, null));
          return this.exportEntry(RedBlackTree.entryOrNull(node));
     }

     public floorKey(key: K): K {
          return TreeMap.keyOrNull(this.floorEntry(key));
     }

     public ceilingEntry(key: K): MapEntry<K, V>{
          let node = this.m_RedBlackTree.getCeilingNode(new TreeMapEntry<K,V>(key, null));
          return this.exportEntry(RedBlackTree.entryOrNull(node));
     }

     public ceilingKey(key: K): K {
          return TreeMap.keyOrNull(this.ceilingEntry(key));
     }

     public higherEntry(key: K): MapEntry<K, V> {
          let higherNode = this.m_RedBlackTree.getHigherNode(new TreeMapEntry<K,V>(key, null));
          return this.exportEntry(RedBlackTree.entryOrNull(higherNode));
     }

     public higherKey(key: K): K {
          return TreeMap.keyOrNull(this.higherEntry(key));
     }

     public keySet(): Set<K> {
          return this.navigableKeySet();
     }

     private m_NavigableKeySet : NavigableSet<K> = null;

     public navigableKeySet(): NavigableSet<K> {
          if(this.m_NavigableKeySet === null){
               this.m_NavigableKeySet = new TreeMapKeySet<K, V>(this);
          }
          return this.m_NavigableKeySet;
     }

     public descendingKeySet(): NavigableSet<K> {
          return this.descendingMap().navigableKeySet();
     }

     private m_Values: Collection<V> = null;
     public values(): Collection<V> {
          if(this.m_Values === null){
               this.m_Values = new TreeMapValues(this.m_RedBlackTree);
          }
          return this.m_Values;
     }

     public entrySet(): Set<MapEntry<K, V>> {
          return new TreeMapEntrySet<K, V>(this.m_RedBlackTree);
     }

     public descendingMap(): NavigableMap<K, V> {
          return new DescendingSubMap(this, true, null, true, true, null, true);
     }

     public subMap(fromKey: K, toKey: K): NavigableMap<K, V>;
     public subMap(fromKey: K, fromInclusive: boolean, toKey: K, toInclusive: boolean): NavigableMap<K, V>;
     public subMap(fromKey: K, toKeyOrFromInclusive : boolean | K, toKey ?: K, toInclusive?: boolean): NavigableMap<K, V> | SortedMap<K, V>{
          return null;
     }

     public headMap(toKey: K): NavigableMap<K, V>;
     public headMap(toKey: K, toInclusive: boolean): NavigableMap<K, V>;
     public headMap(toKey: K, toInclusive ?: boolean): NavigableMap<K, V> | SortedMap<K, V>{
          return null;
     }

     public tailMap(toKey: K): NavigableMap<K, V>;
     public tailMap(fromKey: K, fromInclusive: boolean): NavigableMap<K, V>;
     public tailMap(fromKey: K, fromInclusive ?: boolean): NavigableMap<K, V> | SortedMap<K, V>{
          return null;
     }

     public replace(key: K, value: V): V;
     public replace(key: K, newValue: V, oldValue: V): boolean;
     public replace(key: K, newValue: V, paramOldValue?: V): boolean | V {
          let node = this.m_RedBlackTree.getRedBlackTreeNode(new TreeMapEntry<K, V>(key, null));
          let entry = RedBlackTree.entryOrNull(node);
          if(entry === null){
               return false;
          }
          let oldValue = entry.getValue();
          let povany = paramOldValue as any;
          if(paramOldValue === undefined){
               if(entry !== null ){
                    entry.setValue(newValue);
                    return oldValue;
               }else {
                    return null;
               }
          }else if(povany.equals(oldValue)){
               entry.setValue(newValue);
               return true;
          }else {
               return false;
          }
     }

     public compareKeys(k1: K, k2: K): number {
          return this.m_RedBlackTree.compareValues(new TreeMapEntry<K, V>(k1, null), new TreeMapEntry<K, V>(k1, null));
     }

     exportEntry(entry: MapEntry<K, V>): MapEntry<K, V> {
          if(entry === undefined || entry === null){
               return null;
          }
          return new ImmutableMapEntry(entry);
     }

     public static keyOrNull<K, V>(entry: MapEntry<K, V>): K {
          return entry === null ? null : entry.getKey();
     }

     public static valueOrNull<K, V>(entry: MapEntry<K,V>): V {
          return entry === null ? null : entry.getValue();
     }
	
     keyIterator(): Iterator<K> {
          return new TreeMapKeyIterator(this.m_RedBlackTree.getFirstNode(), this.m_RedBlackTree);
     }

     descendingKeyIterator(): Iterator<K> {
          return new TreeMapDescendingKeyIterator(this.m_RedBlackTree.getLastNode(), this.m_RedBlackTree);
     }

     public successor(key: K): TreeMapEntry<K, V>{
          let entry = this.m_RedBlackTree.getSuccessor(new TreeMapEntry<K, V>(key, null));
          return entry;
     }
}

