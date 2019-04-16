import { Iterator } from "./iterator";

export interface ListIterator<E> extends Iterator<E> {
     hasPrevious(): boolean;
     previous(): E;
     nextIndex(): number;
     previousIndex(): number;
     remove(): void;
     set(value: E): void;
     add(value: E): void;
}