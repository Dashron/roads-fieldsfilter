"use strict";

module.exports = function () {
	var representation = {};

	representation.uri = '/users/1';
	representation.name = 'aaron';
	representation.url = 'http://dashron.com/users/1';

	// Functions are only executed if the 
	representation.stats = function () {
		console.log('This function is being executed because you have requested the stats field');

		// You should use functions like this if you require complex, time intensive processing.
		return {
			'plays' : 1,
			'loads' : 2,
			'likes' : 43
		};
	};

	// If arrays are included, the array is retained and we filter down into each object.
	// ?fields=multi.field will become an an array of objects with just the "field" key.
	representation.multi = [{
		field : "things",
		value : "morethings"
	},{
		field : "things2",
		value : "what"
	},{
		field : "things3",
		value : "is"
	},{
		field : "things4",
		value : "this"
	}];

	// You can make additional, async API requests to sub-resources right from the representation.
	// Be careful with this pattern. You will perform a request for each item in a collection response.
	// This is useful, but it's important to optimize the quantity of calls you make
	representation.sub = this.request('GET', '/sub');

	return representation;
};