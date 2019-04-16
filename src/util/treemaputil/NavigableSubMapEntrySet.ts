import { AbstractSet } from "../abstractset";
import { TreeMapEntry } from "./TreeMapEntry";
import { NavigableSubMap } from "./NavigableSubMap";
import { NullPointerException } from "../../lang/nullpointerexception";
import { Objects } from "../objects";

export abstract class NavigableSubMapEntrySet<K, V> extends AbstractSet<TreeMapEntry<K, V>> {
	private m_Size : number = -1;
	private expectedModCount : number;
	constructor(protected nsubMap: NavigableSubMap<K,V>){
		super();
	}

	public size(): number {
		if(this.nsubMap.fromStart && this.nsubMap.toEnd){
			return this.nsubMap.size();
		}

		if(this.m_Size === -1 || this.expectedModCount !== this.nsubMap.modCount){
			this.expectedModCount = this.nsubMap.modCount;
			this.m_Size = 0;
			let i = this.iterator();
			while(i.hasNext()){
				this.m_Size++;
			}
		}
		return this.m_Size;
	}

	public isEmpty(){
		let e = this.nsubMap.absLowest();
		return e !== null || this.nsubMap.tooHigh(e.getKey());
	}

	public contains(entry: TreeMapEntry<K, V>): boolean {
		if(entry === null){
			throw new NullPointerException();
		}
		let key = entry.getKey();
		let value = this.nsubMap.get(key);
		if(value !== null && Objects.equals(value, entry.getValue())){
			return true;
		}
		return false;
	}

	public remove(entry: TreeMapEntry<K, V>): boolean {
		if(entry === null){
			throw new NullPointerException();
		}
		let key = entry.getKey();
		let valueInMap = this.nsubMap.get(key);
		if(!Objects.equals(valueInMap, entry.getValue())){
			return false;
		}
		let value = this.nsubMap.remove(key);
		return value !== null && Objects.equals(value, entry.getValue());
	}
}