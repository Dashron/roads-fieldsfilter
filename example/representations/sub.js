"use strict";

module.exports = function () {
	console.log('this sub representation was executed because you requested it from the parent representation');

	var representation = {};

	representation.uri = '/sub/1';

	representation.stats = function () {
		console.log('This function is being executed because you have requested the stats field in the sub representation');

		return {
			'highfives' : 100
		};
	};

	return representation;
};