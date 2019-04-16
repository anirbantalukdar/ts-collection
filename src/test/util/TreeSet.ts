import { TreeSet } from "../../util/TreeSet";
import { Integer, IntegerComparator } from "./Integer";
import assert = require("assert");
import { ArrayList } from "../../util/arraylist";

describe('testing TreeSet with Integer Comparator', function(){
	let ts : TreeSet<Integer> = null;

	beforeEach(function(done){
		ts = new TreeSet<Integer>(new IntegerComparator());

		ts.add(new Integer(4));
		ts.add(new Integer(1));
		ts.add(new Integer(3));
		ts.add(new Integer(2));
		ts.add(new Integer(16));
		ts.add(new Integer(9));
		ts.add(new Integer(10));
		ts.add(new Integer(14));
		ts.add(new Integer(8));
		ts.add(new Integer(7));
		done();
	});

	afterEach(function(done){
		done();
	});

	it('testing add operation', function(done){
		assert(ts.size() === 10, 'size of the treeset should be 10 after adding all the elemnts');
		done();
	});

	it('testing lower', function(done){
		assert(ts.lower(new Integer(16)).num === 14);
		assert(ts.lower(new Integer(14)).num === 10);
		assert(ts.lower(new Integer(10)).num === 9);
		assert(ts.lower(new Integer(9)).num === 8);
		assert(ts.lower(new Integer(8)).num === 7);
		assert(ts.lower(new Integer(7)).num === 4);
		assert(ts.lower(new Integer(4)).num === 3);
		assert(ts.lower(new Integer(3)).num === 2);
		assert(ts.lower(new Integer(2)).num === 1);
		done();
	});

	it('testing higher', function(done){
		assert(ts.higher(new Integer(14)).num === 16);
		assert(ts.higher(new Integer(10)).num === 14);
		assert(ts.higher(new Integer(9)).num === 10);
		assert(ts.higher(new Integer(8)).num === 9);
		assert(ts.higher(new Integer(7)).num === 8);
		assert(ts.higher(new Integer(4)).num === 7);
		assert(ts.higher(new Integer(3)).num === 4);
		assert(ts.higher(new Integer(2)).num === 3);
		assert(ts.higher(new Integer(1)).num === 2);
		done();
	});

	it('testing remove', function(done){
		assert(ts.size() === 10);
		let arr = [16, 14, 10, 9, 8,7, 4, 3,2, 1];
		for(let i=0; i<arr.length; i++){
			assert(ts.contains(new Integer(arr[i])) === true, 'initial contains test' + arr[i]);
		}

		while(arr.length !== 0){
			let e = arr[arr.length - 1];
			arr.splice(arr.length - 1, 1);
			assert(ts.remove(new Integer(e)) === true, 'remove should return true');
			for(let i=0; i<arr.length; i++){
				assert(ts.contains(new Integer(arr[i])) === true, 'contains ' + arr[i] + 'after removing ' + e);
			}
		}
		done();
	})
})