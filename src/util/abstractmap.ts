import { Map, MapEntry, AbstractMapEntry, isMapEntry } from "./map";
import { Set } from "./set";
import { Iterator } from "./iterator";
import { UnsupportedOperationException } from "../lang/unsupportedoperationexception";
import { AbstractSet } from "./abstractset";
import { AbstractCollection } from "./abstractcollection";
import { Collection } from "./collection";
import { IllegalArgumentException } from "../lang/illegalargumentexception";

export abstract class AbstractMap<K, V> implements Map<K, V> {
     protected constructor(){

     }

     public size(): number {
          return this.entrySet().size();
     }

     public isEmpty(): boolean {
          return this.size() === 0;
     }

     public containsKey(key: K): boolean {
          let itr : Iterator<MapEntry<K,V>> = this.entrySet().iterator();
          if(key === null){
               while(itr.hasNext()){
                    let e = itr.next();
                    if(e.getKey() === null){
                         return true;
                    }
               }
          }else {
               while(itr.hasNext()){
                    let e = itr.next();
                    let keyAny = key as any;
                    if(keyAny.equals(e.getKey())){
                         return true;
                    }
               }
          }
          return false;
     }

     public containsValue(value: V): boolean {
          let itr: Iterator<MapEntry<K, V>>  = this.entrySet().iterator();
          if(value === null){
               while(itr.hasNext()){
                    let e = itr.next();
                    if(e.getValue() === null){
                         return true;
                    }
               }
          }else {
               while(itr.hasNext()){
                    let e = itr.next();
                    let valueAny = value as any;
                    if(valueAny.equals(e.getValue())){
                         return true;
                    }
               }
          }
          return false;
     }

     public get(key: K): V {
          let itr = this.entrySet().iterator();
          if(key === null){
               while(itr.hasNext()){
                    let e = itr.next();
                    if(e.getKey() === null){
                         return e.getValue();
                    }
               }
          }else {
               while(itr.hasNext()){
                    let e = itr.next();
                    let keyAny = e.getKey() as any;
                    if(keyAny.equals(key)){
                         return e.getValue();
                    }
               }
          }
          return null;
     }

     public put(key: K, v: V): V {
          throw new UnsupportedOperationException();
     }

     public remove(key: K): V {
          let itr = this.entrySet().iterator();
          let correctEntry = null;
          if(key === null){
               while(correctEntry === null && itr.hasNext()){
                    let e = itr.next();
                    if(e.getKey() === null){
                         correctEntry = e;
                    }
               }
          }else {
               while(correctEntry === null && itr.hasNext()){
                    let e = itr.next();
                    let keyAny = key as any;
                    if(keyAny.equals(e.getKey())){
                         correctEntry = e;
                    }
               }
          }
          let oldValue = null;
          if(correctEntry !== null){
               oldValue = correctEntry.getValue();
               itr.remove();
          }
          return oldValue;
     }

     public putAll(m: Map<K, V>){
          let itr = this.entrySet().iterator();
          while(itr.hasNext()){
               let e = itr.next();
               this.put(e.getKey(), e.getValue());
          }
     }

     public clear(): void {
          this.entrySet().clear();
     }

     public keySet(): Set<K> {
          return new MapKeySet(this);
     }

     public abstract entrySet(): Set<MapEntry<K, V>>;

     public values(): Collection<V> {
          return new MapValueCollection(this);
     }
}

class MapKeySet<K, V> extends AbstractSet<K> {
     
     constructor(private map: AbstractMap<K, V>){
          super();
     }

     public iterator(): Iterator<K> {
          return new MapKeySetIterator(this.map.entrySet().iterator());
     }

     public size(): number {
          return this.map.size();
     }

     public isEmpty(): boolean {
          return this.map.isEmpty();
     }

     public clear(): void {
          this.map.clear();
     }

     public contains(key: K): boolean {
          return this.map.containsKey(key);
     }
}

class MapKeySetIterator<K, V> implements Iterator<K> {
     constructor(private entrySetIterator: Iterator<MapEntry<K, V>>){

     }

     public hasNext(): boolean {
          return this.entrySetIterator.hasNext();
     }

     public next(): K {
          return this.entrySetIterator.next().getKey();
     }

     public remove(): void {
          return this.entrySetIterator.remove();
     }
}

class MapValueCollection<K, V> extends AbstractCollection<V> {
     constructor(private map: AbstractMap<K, V>){
          super();
     }

     public size(): number {
          return this.map.size();
     }

     public isEmpty(): boolean {
          return this.map.isEmpty();
     }

     public clear(): void {
          this.map.clear();
     }

     public contains(value: V){
          return this.map.containsValue(value);
     }

     public iterator(): Iterator<V> {
          return new MapValueCollectionIterator(this.map.entrySet().iterator());
     }
}

class MapValueCollectionIterator<K, V> implements Iterator<V> {
     constructor(private entrySetIterator: Iterator<MapEntry<K, V>>){

     }

     public hasNext(): boolean {
          return this.entrySetIterator.hasNext();
     }

     public next(): V {
          return this.entrySetIterator.next().getValue();
     }

     public remove(): void {
          this.entrySetIterator.remove();
     }
}

export class ImmutableMapEntry<K, V> extends AbstractMapEntry<K, V> {
     private key: K;
     private value: V;

     public constructor(mapEntry: MapEntry<K, V>)
     public constructor(key: K, value: V)
     public constructor(keyOrMapEntry: any, value ?: V){
          super();
          if(isMapEntry<K, V>(keyOrMapEntry)){
               this.key = keyOrMapEntry.getKey();
               this.value = keyOrMapEntry.getValue();
          }else{
               this.key = keyOrMapEntry;
               this.value = value;
          }
     }

     public getKey(): K {
          return this.key;
     }

     public getValue(): V {
          return this.value;
     }

     public setValue(value: V): V {
          throw new UnsupportedOperationException();
     }

     public equals(obj: any): boolean{
          throw new UnsupportedOperationException();
     }

}

export class MutableMapEntry<K, V> extends AbstractMapEntry<K, V> {
     private key: K;
     private value: V;

     public constructor(mapEntry: MapEntry<K, V>)
     public constructor(key: K, value: V)
     public constructor(keyOrMapEntry: any, value ?: V){
          super();
          if(isMapEntry<K, V>(keyOrMapEntry)){
               this.key = keyOrMapEntry.getKey();
               this.value = keyOrMapEntry.getValue();
          }else{
               if(value ===undefined || value === null){
                    throw new IllegalArgumentException();
               }
               this.key = keyOrMapEntry;
               this.value = value;
          }
     }

     public getKey(): K {
          return this.key;
     }

     public getValue(): V {
          return this.value;
     }

     public setValue(value: V): V {
          this.value = value;
          return value;
     }

     public equals(obj: any): boolean{
          return true;
     }
}
