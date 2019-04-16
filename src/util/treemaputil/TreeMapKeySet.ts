import { AbstractSet } from "../abstractset";
import { NavigableSet } from "../navigableset";
import { NavigableMap } from "../navigablemap";
import { TreeMap } from "../treemap";
import { Iterator } from "../iterator";
import { Comparator } from "../comparator";
import { NavigableSubMap } from "./NavigableSubMap";

export class TreeMapKeySet<K, V> extends AbstractSet<K> implements NavigableSet<K> {
     constructor(private map: NavigableMap<K, V>){
          super();
     }

     public iterator(): Iterator<K> {
          if(this.map instanceof TreeMap){
               return this.map.keyIterator();
          }else if(this.map instanceof NavigableSubMap){
               return (this.map as NavigableSubMap<K, V>).keyIterator();
          }
          return null;
     }

     public descendingIterator(): Iterator<K> {
          if(this.map instanceof TreeMap){
               return this.map.descendingKeyIterator();
          }else if(this.map instanceof NavigableSubMap){
               return this.map.descendingKeyIterator();
          }
          return null;
     }

     public size(): number {
          return this.map.size();
     }

     public isEmpty(): boolean {
          return this.map.isEmpty();
     }

     public contains(key: K){
          return this.map.containsKey(key);
     }

     public clear(): void {
          this.map.clear();
     }

     public lower(key: K): K {
          return this.map.lowerKey(key);
     }

     public floor(key: K): K{ 
          return this.map.floorKey(key); 
     }

     public ceiling(key: K): K { 
          return this.map.ceilingKey(key); 
     }
     
     public higher(key: K): K { 
          return this.map.higherKey(key);
     }

     public first(): K { 
          return this.map.firstKey(); 
     }

     public last(): K { 
          return this.map.lastKey(); 
     }
        
     public comparator(): Comparator<K> { 
          return this.map.comparator(); 
     }

     public pollFirst(): K {
          let e = this.map.pollFirstEntry();
          return e === null ? null : e.getKey();
     }

     public pollLast(): K {
          let e = this.map.pollLastEntry();
          return e === null ? null : e.getKey();
     }

     public remove(key: K): boolean{
          let oldSize = this.size();
          this.map.remove(key);
          return this.size() !== oldSize;

     }

     public subSet(fromElement: K, toElement: K): NavigableSet<K>;
     public subSet(fromElement: K, fromInclusive: boolean, toElement: K, toInclusive: boolean): NavigableSet<K>;
     public subSet(fromElement: K, toElementOrfromInclusive: boolean | K, toEle ?: K, toIncl ?: boolean): NavigableSet<K> {
          if(typeof toElementOrfromInclusive === 'boolean'){
               return new TreeMapKeySet<K, V>(this.map.subMap(fromElement, toElementOrfromInclusive, toEle, toIncl));
          }else{
               return new TreeMapKeySet<K, V>(this.map.subMap(fromElement, true, toEle, false));
          }
     }

     public headSet(toElement: K): NavigableSet<K>;
     public headSet(toElement: K, inclusive: boolean): NavigableSet<K>;
     public headSet(toElement: K, inclusive ?: boolean): NavigableSet<K> {
          if(inclusive === undefined){
               inclusive = false;
          }
          return new TreeMapKeySet<K, V>(this.map.headMap(toElement, inclusive));
     }

     public tailSet(fromElement: K): NavigableSet<K>;
     public tailSet(fromElement: K, inclusive: boolean): NavigableSet<K>;
     public tailSet(fromElement: K, inclusive?: boolean): NavigableSet<K> {
          if(inclusive === undefined){
               inclusive = false;
          }
          return new TreeMapKeySet<K, V>(this.map.tailMap(fromElement, inclusive));
     }

     public descendingSet(): NavigableSet<K> {
          return new TreeMapKeySet<K, V>(this.map.descendingMap());
     }
}
