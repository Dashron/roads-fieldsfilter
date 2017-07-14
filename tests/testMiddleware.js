"use strict";

var middleware = require('../index').middleware;

/**
 * Create a mock object to expand
 */
function testResponseObject (expand_func) {
	var response = {
		"name" : "aaron",
		"description" : "developer",
		"images" : [{
			"url" : "http://www.dashron.com/image1.png",
			"type" : "profile"
		}, {
			"url" : "http://www.dashron.com/image2.png",
			"type" : "background"
		}],
		"active_image" : {
			"url" : "http://www.dashron.com/image1.png",
			"type" : "profile"
		},
		"delayed" : function () {
			return "hello";
		},
		"delayed_obj" : function () {
			return {
				"test" : "yeah",
				"huh" : "what"
			};
		},
		"delayed_array" : function () {
			return [{
				"name" : "bob",
			}, {
				"name" : "tom"
			}];
		}
	};

	if (expand_func === true) {
		response.delayed = response.delayed();
		response.delayed_obj = response.delayed_obj();
		response.delayed_array = response.delayed_array();
	}

	return response;
}

/**
 * Test that a single key will filter out everything but that key
 */
exports.testAsFirstMiddleware = function (test) {
	test.expect(1);

	middleware()('GET', {
			path : '/users',
			query : {}
		}, {}, {}, function () {
		return new Promise(function (resolve, reject) {
			// resolve with a fake response object
			resolve({
				body : testResponseObject()
			});
		});
	})
	.then(function (filtered_response) {
		test.deepEqual(testResponseObject(true), filtered_response.body);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
	});
};//*/


/**
 * Test that a undefined response doesn't error
 */
exports.testMiddlewareReturnsNothing = function (test) {
	test.expect(1);

	middleware()('GET', {
			path : '/users',
			query : {}
		}, {}, {}, function () {
		return new Promise(function (resolve, reject) {
			// resolve with a fake response object
			resolve();
		});
	})
	.then(function (filtered_response) {
		test.deepEqual(undefined, filtered_response);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
	});
};//*/