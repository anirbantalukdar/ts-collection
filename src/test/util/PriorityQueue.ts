
import assert = require("assert");
import { Integer, IntegerComparator } from "./Integer";
import { PriorityQueue } from "../../util/priorityqueue";


function left(index: number): number {
	return 2*index + 1;
}

function right(index: number): number {
	return 2*index + 2;
}

describe('testing priorityqueue with Integer comparator', function(){
	let pq : PriorityQueue<Integer> = null;
	beforeEach(function(done){
		pq = new PriorityQueue(new IntegerComparator());

		pq.add(new Integer(4));
		pq.add(new Integer(1));
		pq.add(new Integer(3));
		pq.add(new Integer(2));
		pq.add(new Integer(16));
		pq.add(new Integer(9));
		pq.add(new Integer(10));
		pq.add(new Integer(14));
		pq.add(new Integer(8));
		pq.add(new Integer(7));
		done();
	});

	after(function(done){
		done();
	});

	it('testing size', function(done){
		assert(pq.size() === 10, 'priorityquere size should be 10');
		done();
	});

	it('testing isEmpty', function(done){
		assert(pq.isEmpty() === false, 'pq should not be empty');
		done();
	})

	it('testing isEmpty', function(done){
		assert(pq.size() === 10, 'pq should not be empty');
		pq.clear();
		assert(pq.size() === 0, 'pq should be empty');
		assert(pq.isEmpty() === true, 'pq should be empty');
		done();
	});

	it('testing poll', function(done){
		checkHeap();
		done();
	});

	function checkHeap(){
		let arr = new Array<Integer>();
		while(!pq.isEmpty()){
			arr.push(pq.poll());
		}
		for(let i=1; i<arr.length; i++){
			assert(arr[i-1] >= arr[i], 'heap should alwyas maximum at its top');
		}
		assert(pq.size() === 0, 'pq should be empty');
	}

	it('testing remove', function(done){
		pq.remove(new Integer(10));
		assert(pq.size() === 9, 'after deleting 16 pq should have 9 elements');
		checkHeap();
		done();
	});
})