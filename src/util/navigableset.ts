import { SortedSet } from "./sortedset";
import { Iterator } from "./iterator";

export interface NavigableSet<E> extends SortedSet<E> {
     lower(e: E): E;
     floor(e: E): E;
     ceiling(e: E): E;
     higher(e: E): E;
     pollFirst(): E;
     pollLast(): E;

     descendingSet(): NavigableSet<E>;
     descendingIterator(): Iterator<E>;
     subSet(fromElement: E, toElement: E): NavigableSet<E>;
     subSet(fromElement: E, fromInclusive: boolean, toElement: E, toInclusive: boolean) : NavigableSet<E>;

     headSet(toElement: E, inclusive: boolean): NavigableSet<E>;
     headSet(toElement: E): NavigableSet<E>;
     tailSet(fromElement: E, inclusive: boolean): NavigableSet<E>;
     tailSet(fromElement: E): NavigableSet<E>;
}