import { NullPointerException } from "../lang/nullpointerexception";
import { Comparable } from "./comparable";
import { Comparator } from "./comparator";
import { TreeMapEntry } from "./treemaputil/TreeMapEntry";
import { NoSuchElementException } from "./nosuchelementexception";

export enum RedBlackColor {
	RED,
	BLACK
}
export class RedBlackTreeNode<V> {
	value: V;
	left: RedBlackTreeNode<V>
	right: RedBlackTreeNode<V>;
	parent: RedBlackTreeNode<V>
	color: RedBlackColor;

	constructor(value: V, parent?: RedBlackTreeNode<V>) {
		this.value = value;
		if (parent === undefined) {
			parent = null;
		}
		this.parent = parent;
		this.left = this.right = null;
		this.color = RedBlackColor.BLACK;
	}
};

export class RedBlackTree<V> {
	private m_Root: RedBlackTreeNode<V>;
	private m_Comparator: Comparator<V>;
	private m_Size: number = 0;
	public modCount = 0;

	constructor(comparator ?: Comparator<V>) {
		if(comparator === null){
			throw new NullPointerException();
		}
		this.m_Comparator = comparator;
		this.m_Root = null;
	}

	public comparator(){
		return this.m_Comparator;
	}

	public contains(value: V): boolean {
		return this.getRedBlackTreeNode(value) !== null;
	}

	public remove(value: V): V {
		let p = this.getRedBlackTreeNode(value);
		if (p !== null) {
			this.deleteEntry(p);
			this.modCount ++;
			this.m_Size --;
			return p.value;
		}
		return null;
	}

	public clear(): void {
		this.m_Root = null;
	}

	public put(value: V): V {
		let t = this.m_Root;
		if (t === null) {
			this.m_Root = new RedBlackTreeNode(value);
			this.m_Size = 1;
			this.modCount ++;
			return null;
		}
		let cmp: number;
		let parent: RedBlackTreeNode<V>;
		let cpr = this.m_Comparator;
		if (cpr !== null) {
			do {
				parent = t;
				cmp = cpr.compare(value, t.value);
				if (cmp < 0) {
					t = t.left;
				} else if (cmp > 0) {
					t = t.right;
				} else {
					return value;
				}
			} while (t !== null);
		} else {
			let k = <any>value as Comparable<V>;
			do {
				parent = t;
				cmp = k.compareTo(t.value);
				if (cmp < 0) {
					t = t.left;
				} else if (cmp > 0) {
					t = t.right;
				} else {
					return value;
				}
			} while (t !== null);
		}
		let e = new RedBlackTreeNode<V>(value, parent);
		if (cmp < 0) {
			parent.left = e;
		} else {
			parent.right = e;
		}
		this.fixAfterInsertion(e);
		this.modCount ++;
		this.m_Size++;
		return null;
	}

	public getPredecessor(value: V): V {
		let node = this.getRedBlackTreeNode(value);
		if(node === null){
			return null;
		}
		let pred : RedBlackTreeNode<V> = this.predecessor(node);
		return RedBlackTree.entryOrNull(pred);
	}

	public getSuccessor(value: V): V {
		let node = this.getRedBlackTreeNode(value);
		if(node === null){
			return null;
		}
		let pred : RedBlackTreeNode<V> = this.successor(node);
		return RedBlackTree.entryOrNull(pred);
	}

	public getFirstNode(): RedBlackTreeNode<V> {
		let p = this.m_Root;
		if (p === null) {
			return null;
		}
		while (p.left !== null) {
			p = p.left;
		}
		return p;
	}

	public getLastNode(): RedBlackTreeNode<V> {
		let p = this.m_Root;
		if (p === null) {
			return null;
		}
		while (p.right !== null) {
			p = p.right;
		}
		return p;
	}

	public compareValues(v1: V, v2: V): number {
		if (this.m_Comparator !== null) {
			return this.m_Comparator.compare(v1, v2);
		} else {
			let vc1 = <any>v1 as Comparable<V>;
			return vc1.compareTo(v2);
		}
	}

	public getCeilingNode(value: V): RedBlackTreeNode<V> {
		let p = this.m_Root;
		while (p !== null) {
			let cmp = this.compareValues(value, p.value);
			if (cmp < 0) {
				if (p.left !== null) {
					p = p.left;
				} else {
					return p;
				}
			} else if (cmp > 0) {
				if (p.right !== null) {
					p = p.right;
				} else {
					let parent = p.parent;
					let child = p;
					while (parent !== null && child === parent.right) {
						child = parent;
						parent = parent.parent;
					}
					return parent;
				}
			} else {
				return p;
			}
		}
		return null;
	}

	public getFloorNode(value: V): RedBlackTreeNode<V> {
		let p = this.m_Root;
		while (p !== null) {
			let cmp = this.compareValues(value, p.value);
			if (cmp > 0) {
				if (p.right !== null) {
					p = p.right;
				} else {
					return p;
				}
			} else if (cmp < 0) {
				if (p.left !== null) {
					p = p.left;
				} else {
					let parent = p.parent;
					let child = parent;
					while (parent !== null && child === parent.left) {
						child = parent;
						parent = parent.parent;
					}
					return parent;
				}
			} else {
				return p;
			}
		}
		return null;
	}

	public getHigherNode(value: V): RedBlackTreeNode<V> {
		let p = this.m_Root;
		while (p != null) {
			let cmp = this.compareValues(value, p.value);
			if (cmp < 0) {
				if (p.left != null)
					p = p.left;
				else
					return p;
			} else {
				if (p.right != null) {
					p = p.right;
				} else {
					let parent = p.parent;
					let ch = p;
					while (parent != null && ch == parent.right) {
						ch = parent;
						parent = parent.parent;
					}
					return parent;
				}
			}
		}
		return null;
	}

	public getLowerNode(value: V): RedBlackTreeNode<V> {
		let p = this.m_Root;
		while (p != null) {
			let cmp = this.compareValues(value, p.value);
			if (cmp > 0) {
				if (p.right != null)
					p = p.right;
				else
					return p;
			} else {
				if (p.left != null) {
					p = p.left;
				} else {
					let parent = p.parent;
					let ch = p;
					while (parent != null && ch == parent.left) {
						ch = parent;
						parent = parent.parent;
					}
					return parent;
				}
			}
		}
		return null;
	}

	public isEmpty(): boolean {
		return this.m_Root !== null;
	}

	public size(): number {
		return this.m_Size;
	}

	public getRedBlackTreeNode(value: V): RedBlackTreeNode<V> {
		if (this.m_Comparator !== null) {
			return this.getNodeUsingComparator(value);
		}
		if (value === null) {
			throw new NullPointerException();
		}
		let v = <any>value as Comparable<V>;
		let p = this.m_Root;
		while (p !== null) {
			let cmp = v.compareTo(p.value);
			if (cmp < 0) {
				p = p.left;
			} else if (cmp > 0) {
				p = p.right;
			} else {
				return p;
			}
		}
		return null;
	}

	private getNodeUsingComparator(value: V): RedBlackTreeNode<V> {
		let cpr = this.m_Comparator;
		if (cpr !== null) {
			let p = this.m_Root;
			while (p !== null) {
				let cmp = cpr.compare(value, p.value);
				if (cmp < 0) {
					p = p.left;
				} else if (cmp > 0) {
					p = p.right;
				} else {
					return p;
				}
			}
		}
		return null;
	}

	private colorOf<V>(node: RedBlackTreeNode<V>) {
		if (node === null) {
			return RedBlackColor.BLACK;
		}
		return node.color;
	}

	private setColor<V>(node: RedBlackTreeNode<V>, color: RedBlackColor): void {
		if (node !== null) {
			node.color = color;
		}
	}

	private leftOf<V>(node: RedBlackTreeNode<V>): RedBlackTreeNode<V> {
		return node === null ? null : node.left;
	}

	private rightOf<V>(node: RedBlackTreeNode<V>): RedBlackTreeNode<V> {
		return node === null ? null : node.right;
	}

	private parentOf(node: RedBlackTreeNode<V>): RedBlackTreeNode<V> {
		return node === null ? null : node.parent;
	}

	private rotateLeft(node: RedBlackTreeNode<V>): void {
		let p = node;
		if (p !== null) {
			let r = p.right;
			p.right = r.left;
			if (r.left != null)
				r.left.parent = p;
			r.parent = p.parent;
			if (p.parent == null)
				this.m_Root = r;
			else if (p.parent.left == p)
				p.parent.left = r;
			else
				p.parent.right = r;
			r.left = p;
			p.parent = r;
		}
	}

	private rotateRight(node: RedBlackTreeNode<V>): void {
		let p = node;
		if (p != null) {
			let l = p.left;
			p.left = l.right;
			if (l.right != null) l.right.parent = p;
			l.parent = p.parent;
			if (p.parent == null)
				this.m_Root = l;
			else if (p.parent.right == p)
				p.parent.right = l;
			else p.parent.left = l;
			l.right = p;
			p.parent = l;
		}
	}

	private fixAfterInsertion(x: RedBlackTreeNode<V>): void {
		x.color = RedBlackColor.RED;
		while (x !== null && x != this.m_Root && x.parent.color == RedBlackColor.RED) {
			if (this.parentOf(x) == this.leftOf(this.parentOf(this.parentOf(x)))) {
				let y = this.rightOf(this.parentOf(this.parentOf(x)));
				if (this.colorOf(y) == RedBlackColor.RED) {
					this.setColor(this.parentOf(x), RedBlackColor.BLACK);
					this.setColor(y, RedBlackColor.BLACK);
					this.setColor(this.parentOf(this.parentOf(x)), RedBlackColor.RED);
					x = this.parentOf(this.parentOf(x));
				} else {
					if (x == this.rightOf(this.parentOf(x))) {
						x = this.parentOf(x);
						this.rotateLeft(x);
					}
					this.setColor(this.parentOf(x), RedBlackColor.BLACK);
					this.setColor(this.parentOf(this.parentOf(x)), RedBlackColor.RED);
					this.rotateRight(this.parentOf(this.parentOf(x)));
				}
			} else {
				let y = this.leftOf(this.parentOf(this.parentOf(x)));
				if (this.colorOf(y) == RedBlackColor.RED) {
					this.setColor(this.parentOf(x), RedBlackColor.BLACK);
					this.setColor(y, RedBlackColor.BLACK);
					this.setColor(this.parentOf(this.parentOf(x)), RedBlackColor.RED);
					x = this.parentOf(this.parentOf(x));
				} else {
					if (x == this.leftOf(this.parentOf(x))) {
						x = this.parentOf(x);
						this.rotateRight(x);
					}
					this.setColor(this.parentOf(x), RedBlackColor.BLACK);
					this.setColor(this.parentOf(this.parentOf(x)), RedBlackColor.RED);
					this.rotateLeft(this.parentOf(this.parentOf(x)));
				}
			}
		}
		this.m_Root.color = RedBlackColor.BLACK;
	}

	public successor(t: RedBlackTreeNode<V>): RedBlackTreeNode<V> {
		if (t == null)
			return null;
		else if (t.right != null) {
			let p = t.right;
			while (p.left != null)
				p = p.left;
			return p;
		} else {
			let p = t.parent;
			let ch = t;
			while (p != null && ch == p.right) {
				ch = p;
				p = p.parent;
			}
			return p;
		}
	}

	public static key<K,V>(entry: TreeMapEntry<K, V>): K {
          if(entry === null){
               throw new NoSuchElementException();
          }
          return entry.getKey();
     }

	public static entryOrNull<V>(node: RedBlackTreeNode<V>): V {
          return node === null ? null : node.value;
     }

	/**
	 * Returns the predecessor of the specified Entry, or null if no such.
	 */
	public predecessor(t: RedBlackTreeNode<V>): RedBlackTreeNode<V> {
		if (t == null)
			return null;
		else if (t.left != null) {
			let p = t.left;
			while (p.right != null)
				p = p.right;
			return p;
		} else {
			let p = t.parent;
			let ch = t;
			while (p != null && ch == p.left) {
				ch = p;
				p = p.parent;
			}
			return p;
		}
	}

	/**
	 * Delete node p, and then rebalance the tree.
	 */
	public deleteEntry(p: RedBlackTreeNode<V>): void {
		// If strictly internal, copy successor's element to p and then make p
		// point to successor.
		this.m_Size --;
		this.modCount ++;
		if (p.left != null && p.right != null) {
			let s = this.successor(p);
			p.value = s.value;
			p = s;
		} // p has 2 children

		// Start fixup at replacement node, if it exists.
		let replacement = (p.left !== null ? p.left : p.right);

		if (replacement !== null) {
			// Link replacement to parent
			replacement.parent = p.parent;
			if (p.parent === null)
				this.m_Root = replacement;
			else if (p === p.parent.left)
				p.parent.left = replacement;
			else
				p.parent.right = replacement;

			// Null out links so they are OK to use by fixAfterDeletion.
			p.left = p.right = p.parent = null;

			// Fix replacement
			if (p.color === RedBlackColor.BLACK)
				this.fixAfterDeletion(replacement);
		} else if (p.parent === null) { // return if we are the only node.
			this.m_Root = null;
		} else { //  No children. Use self as phantom replacement and unlink.
			if (p.color === RedBlackColor.BLACK)
				this.fixAfterDeletion(p);

			if (p.parent !== null) {
				if (p === p.parent.left)
					p.parent.left = null;
				else if (p === p.parent.right)
					p.parent.right = null;
				p.parent = null;
			}
		}
	}

	/** From CLR */
	private fixAfterDeletion(x: RedBlackTreeNode<V>): void {
		while (x != this.m_Root && this.colorOf(x) == RedBlackColor.BLACK) {
			if (x == this.leftOf(this.parentOf(x))) {
				let sib = this.rightOf(this.parentOf(x));

				if (this.colorOf(sib) == RedBlackColor.RED) {
					this.setColor(sib, RedBlackColor.BLACK);
					this.setColor(this.parentOf(x), RedBlackColor.RED);
					this.rotateLeft(this.parentOf(x));
					sib = this.rightOf(this.parentOf(x));
				}

				if (this.colorOf(this.leftOf(sib)) == RedBlackColor.BLACK &&
					this.colorOf(this.rightOf(sib)) == RedBlackColor.BLACK) {
					this.setColor(sib, RedBlackColor.RED);
					x = this.parentOf(x);
				} else {
					if (this.colorOf(this.rightOf(sib)) == RedBlackColor.BLACK) {
						this.setColor(this.leftOf(sib), RedBlackColor.BLACK);
						this.setColor(sib, RedBlackColor.RED);
						this.rotateRight(sib);
						sib = this.rightOf(this.parentOf(x));
					}
					this.setColor(sib, this.colorOf(this.parentOf(x)));
					this.setColor(this.parentOf(x), RedBlackColor.BLACK);
					this.setColor(this.rightOf(sib), RedBlackColor.BLACK);
					this.rotateLeft(this.parentOf(x));
					x = this.m_Root;
				}
			} else { // symmetric
				let sib = this.leftOf(this.parentOf(x));

				if (this.colorOf(sib) == RedBlackColor.RED) {
					this.setColor(sib, RedBlackColor.BLACK);
					this.setColor(this.parentOf(x), RedBlackColor.RED);
					this.rotateRight(this.parentOf(x));
					sib = this.leftOf(this.parentOf(x));
				}

				if (this.colorOf(this.rightOf(sib)) == RedBlackColor.BLACK &&
					this.colorOf(this.leftOf(sib)) == RedBlackColor.BLACK) {
					this.setColor(sib, RedBlackColor.RED);
					x = this.parentOf(x);
				} else {
					if (this.colorOf(this.leftOf(sib)) == RedBlackColor.BLACK) {
						this.setColor(this.rightOf(sib), RedBlackColor.BLACK);
						this.setColor(sib, RedBlackColor.RED);
						this.rotateLeft(sib);
						sib = this.leftOf(this.parentOf(x));
					}
					this.setColor(sib, this.colorOf(this.parentOf(x)));
					this.setColor(this.parentOf(x), RedBlackColor.BLACK);
					this.setColor(this.leftOf(sib), RedBlackColor.BLACK);
					this.rotateRight(this.parentOf(x));
					x = this.m_Root;
				}
			}
		}
		this.setColor(x, RedBlackColor.BLACK);
	}
}