import { AbstractMapEntry } from "../map";
import { Objects } from "../objects";
import { Comparable } from "../comparable";
import { NullPointerException } from "../../lang/nullpointerexception";

export class TreeMapEntry<K, V> extends AbstractMapEntry<K, V> implements Comparable<TreeMapEntry<K, V>>{
     constructor(public key: K, public value: V){
          super();
     }

     public getKey(): K {
          return this.key;
     }

     public getValue(): V {
          return this.value;
     }

     public setValue(value: V): V {
          let oldValue = this.value;
          this.value = value;
          return oldValue;
     }

     public equals(obj: Object): boolean {
          let rbObj = <any>obj as TreeMapEntry<K, V>;
          return Objects.equals(this.key, rbObj.key) && Objects.equals(this.value, rbObj.value);
     }

     public compareTo(entry: TreeMapEntry<K, V>): number {
          let k = <any>this.key as Comparable<K>
          return k.compareTo(entry.key);
     }

     public compareKey(key: K): number {
          if(key === null){
               throw new NullPointerException();
          }
          let k = <any>this.key as Comparable<K>;
          return k.compareTo(key);
     }
}
