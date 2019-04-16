import { Iterator } from "./iterator";

export interface Collection<E> {
     size(): number;
     isEmpty(): boolean;

     contains(o: Object): boolean;
     iterator(): Iterator<E>;
     toArray(): Array<E>;

     add(e: E): boolean;
     remove(e: E): boolean;
     
     containsAll(c: Collection<any>): boolean;
     addAll(c: Collection<E>): void;
     removeAll(c: Collection<E>): void;
     retainAll(c: Collection<E>): void;
     clear(): void;

     //TODO
     //toArray(): Array<E>;
}

export function isCollection<E>(param: any): param is Collection<E> {
     if(param === undefined || param === null){
          return false;
     }
     return param.size !== undefined
     && param.isEmpty !== undefined
     && param.contains !== undefined
     && param.iterator !== undefined
     && param.toArray !== undefined

     && param.add !== undefined
     && param.remove !== undefined
     
     && param.containsAll !== undefined
     && param.addAll !== undefined
     && param.removeAll !== undefined
     && param.retainAll !== undefined
     && param.clear !== undefined;
}