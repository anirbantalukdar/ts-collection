import { Comparator } from "./comparator";
import { Comparable } from "./comparable";

class ReverseComparator<T> implements Comparator<T> {
	public compare(obj1: T, obj2: T): number {
		let oc2 = <any>obj2 as Comparable<T>;
		return oc2.compareTo(obj1);
	}
}

class ReverseComparator2<T> implements Comparator<T> {
	cmp: Comparator<T> = null;
	public constructor(cmp: Comparator<T>){
		this.cmp = cmp;
	}

	public compare(obj1: T, obj2: T): number {
		return this.cmp.compare(obj2, obj1);
	}

	public reversed(): Comparator<T> {
		return this.cmp;
	}
}

export class Collections {
	private static REVERSE_ORDER = new ReverseComparator();

	public static reverseOrder<T>(cmp: Comparator<T>): Comparator<T>{
		if(cmp === null){
			return this.REVERSE_ORDER;
		}else if(cmp instanceof ReverseComparator2){
			return (cmp as ReverseComparator2<T>).cmp;
		}
		return new ReverseComparator2<T>(cmp);
	}
}

