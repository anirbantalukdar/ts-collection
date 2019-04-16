import { Set } from "./set";
import { Collection } from "./collection";

export interface Map<K, V> {
     size(): number;
     isEmpty(): boolean;
     containsKey(key: K): boolean;
     containsValue(value: V): boolean;
     get(key: K): V;
     put(key: K, value: V): V;
     remove(key: K): V;
     putAll(m: Map<K, V>): void;
     clear(): void;
     keySet(): Set<K>;
     values(): Collection<V>;
     entrySet(): Set<MapEntry<K, V>>;
}

export function isMap<K, V>(param: any): param is Map<K, V>{
     if(param === undefined || param === null){
          return false;
     }
     return param.size !== undefined
          && param.isEmpty !== undefined
          && param.containsKey  !== undefined
          && param.containsValue !== undefined
          && param.get !== undefined
          && param.put !== undefined
          && param.remove !== undefined
          && param.putAll !== undefined
          && param.clear !== undefined
          && param.keySet !== undefined
          && param.values !== undefined
          && param.entrySet !== undefined;
}

export interface MapEntry<K, V> {
     getKey(): K;
     getValue(): V;
     setValue(value: V): V;
     equals(obj: any): boolean;

}

export function isMapEntry<K, V>(param: any): param is MapEntry<K, V> {
     if(param === undefined || param === null){
          return false;
     }
     return param.getKey !== undefined
          && param.getValue !== undefined
          && param.setValue !== undefined
          && param.equals !== undefined;
}

export abstract class AbstractMapEntry<K, V> implements MapEntry<K, V> {
     public abstract getKey(): K;
     public abstract getValue(): V;
     public abstract setValue(value: V): V;
     public abstract equals(obj: any): boolean;
}
