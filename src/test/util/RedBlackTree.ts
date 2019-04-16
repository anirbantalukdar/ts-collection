import { Comparator } from "../../util/comparator";
import { Integer, IntegerComparator } from "./Integer";
import { RedBlackTree } from "../../util/RedBlackTree";
import assert = require("assert");

describe('testing redblack tree', function(){
	let rbTree = new RedBlackTree<Integer>(new IntegerComparator());
	before(function(done){
		rbTree.put(new Integer(11));
		rbTree.put(new Integer(2));
		rbTree.put(new Integer(1));
		rbTree.put(new Integer(7));
		rbTree.put(new Integer(8));
		rbTree.put(new Integer(4));
		rbTree.put(new Integer(5));
		rbTree.put(new Integer(14));
		rbTree.put(new Integer(15));
		rbTree.put(new Integer(10));
		done();
	});

	after(function(done){
		done();
	});

	it('test contains', function(done){
		assert(10 === rbTree.getPredecessor(new Integer(11)).num, '10 is preceding 11');
		assert(14 === rbTree.getSuccessor(new Integer(11)).num, '14 is preceding 11');
		done();
	});
})
