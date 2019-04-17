import { Collection } from "./collection";
import { ListIterator } from "./listiterator";

export interface List<E> extends Collection<E> {
     get(index : number): E;
     setAt(index: number, value: E): E;
     addAt(index: number, value: E): void;
     addAllFrom(index: number, c: Collection<E>): void;
     removeAt(index: number): void;
     indexOf(value: E): number;
     lastIndexOf(value: E): number;
     listIterator(index: number): ListIterator<E>;
     listIteratorFrom(index: number): ListIterator<E>;
}