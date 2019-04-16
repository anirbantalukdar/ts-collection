import { AbstractList } from "./abstractlist";
import { NoSuchElementException } from "./nosuchelementexception";
import { IndexOutOfBoundsException } from "./indexoutofboundsexception";
import { Collection } from "./collection";

export abstract class AbstractSequentialList<E> extends AbstractList<E> {
	public getAt(index: number): E {
		try {
			return this.listIteratorFrom(index).next();
		}catch(ex){
			if(ex instanceof NoSuchElementException){
				throw new IndexOutOfBoundsException('Index: ' + index);
			}else {
				throw ex;
			}
		}
	}

	public set(index: number, element: E): E {
		try {
			let e = this.listIteratorFrom(index);
			let oldVal = e.next();
			e.set(element);
			return oldVal;
		}catch(ex){
			if(ex instanceof NoSuchElementException){
				throw new IndexOutOfBoundsException('Index: ' + index);
			}else{
				throw ex;
			}
		}
	}

	public addAt(index: number, element: E): void {
		try {
			this.listIteratorFrom(index).add(element);
		}catch(ex){
			if(ex instanceof NoSuchElementException){
				ex = new IndexOutOfBoundsException('Index: ' + index);
			}
			throw ex;
		}
	}

	public removeAt(index: number): E {
		try{
			let e = this.listIteratorFrom(index);
			let out = e.next();
			e.remove();
			return out;
		}catch(ex){
			if(ex instanceof NoSuchElementException){
				ex = new IndexOutOfBoundsException('Index: ' + index);
			}
			throw ex;
		}
	}
	
	public addAllFrom(index: number, c: Collection<E>): boolean {
		try {
			let modified = false;
			let e1 = this.listIteratorFrom(index);
			let e2 = c.iterator();
			while(e2.hasNext()){
				e1.add(e2.next());
				modified = true;
			}
			return modified;
		}catch(ex){
			if(ex instanceof NoSuchElementException){
				ex = new IndexOutOfBoundsException('Index: ' + index);
			}
			throw ex;
		}
	}
}