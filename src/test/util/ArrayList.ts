import { ArrayList } from "../../util/arraylist";
import { Integer } from "./Integer";
import assert = require("assert");

describe('testing arraylist', function(){
	let arrlist : ArrayList<Integer> = null;

	beforeEach(function(done){
		arrlist = new ArrayList<Integer>();
		arrlist.add(new Integer(16));
		arrlist.add(new Integer(14));
		arrlist.add(new Integer(10));
		arrlist.add(new Integer(9));
		arrlist.add(new Integer(8));
		arrlist.add(new Integer(7));
		arrlist.add(new Integer(4));
		arrlist.add(new Integer(3));
		arrlist.add(new Integer(2));
		arrlist.add(new Integer(1));
		done();
	})

	it('checking clear and empty', function(done){
		assert(arrlist.size() === 10, 'arrlist size should be 10');
		arrlist.clear();
		assert(arrlist.size() === 0, 'arrlist size should be 0 after clear');
		assert(arrlist.isEmpty() === true, 'arrlist size should be empty after clear');
		done();
	});

	it('checking iterator', function(done){
		let itr = arrlist.iterator();
		let arr = new Array<Integer>();
		while(itr.hasNext()){
			arr.push(itr.next());
		}
		console.log(arr);
		done();
	})
})