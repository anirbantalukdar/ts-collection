import { Set } from "./set";
import { Comparator } from "./comparator";

export interface SortedSet<E> extends Set<E> {
     comparator(): Comparator<E>;

     subSet(fromElement: E, toElement: E): SortedSet<E>;
     headSet(toElement: E): SortedSet<E>;
     tailSet(fromElement: E): SortedSet<E>;
     first(): E;
     last(): E;
}

export function isSortedSet<E>(param: any) : param is SortedSet<E>{
     if(param === undefined || param === null){
          return false;
     }
     return param.comparator !== undefined 
          && param.subSet !== undefined
          && param.headSet !== undefined
          && param.tailSet !== undefined
          && param.first !== undefined
          && param.last !== undefined;
}

