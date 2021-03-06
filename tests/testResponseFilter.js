"use strict";

var FieldsFilter = require('../src/fieldsfilter');

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
 * Test that an empty object filter will render out null
 */
exports.testEmptyFilter = function (test) {
	// empty requests no valid 
	test.expect(1);

	var filter = new FieldsFilter(testResponseObject());
	filter.filter({})
	.then(function (filtered) {
		test.deepEqual(null, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that a single key will filter out everything but that key
 */
exports.testStringFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter("aaron");
	filter.filter(true)
	.then(function (filtered) {
		test.deepEqual("aaron", filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that a single key will filter out everything but that key
 */
exports.testIndividualArrayFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter(["aaron","foo"]);
	filter.filter(true)
	.then(function (filtered) {
		test.deepEqual(["aaron","foo"], filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that a single key will filter out everything but that key
 */
exports.testSingleFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter(testResponseObject());
	filter.filter({
		"name" : true
	})
	.then(function (filtered) {
		test.deepEqual({
			"name" : "aaron"
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that multiple keys will filter out everything but those keys
 */
exports.testMultipleFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter(testResponseObject());
	filter.filter({
		"name" : true,
		"description" : true
	})
	.then(function (filtered) {
		test.deepEqual({
			"name" : "aaron",
			"description" : "developer"
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that a filter that wants a key who's value is an object will show the entire object value
 */
exports.testObjectFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter(testResponseObject());
	filter.filter({
		"active_image" : true
	})
	.then(function (filtered) {
		test.deepEqual({
			"active_image" :  {
				"url" : "http://www.dashron.com/image1.png",
				"type" : "profile"
			}
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});

};//*/

/**
 * Test that a filter that wants the sub-contents of an object will properly display the parent key, and the single sub key
 */
exports.testMultiLevelObjectFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter();
	filter._filterObject({
		"active_image" : {
			"type" : true
		}
	}, testResponseObject())
	.then(function (filtered) {
		test.deepEqual({
			"active_image" : {
				"type" : "profile"
			}
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});

};//*/

/**
 * Test that a filter that sees an array will apply the filter to every value in the array, instead of treating it like an object
 */
exports.testArrayFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter();
	filter._filterObject({
		"name" : true,
		"images" : true
	}, testResponseObject())
	.then(function (filtered) {
		test.deepEqual({
			"name" : "aaron",
			"images" : [{
				"url" : "http://www.dashron.com/image1.png",
				"type" : "profile"
			},{
				"url" : "http://www.dashron.com/image2.png",
				"type" : "background"
			}]
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that a multi level filter in an array will return the proper object heirarchy
 */
exports.testMultiLevelArrayFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter();
	filter._filterObject({
		"name" : true,
		"images" : {
			"url" : true
		}
	}, testResponseObject())
	.then(function (filtered) {
		test.deepEqual({
			"name" : "aaron",
			"images" : [{
				"url" : "http://www.dashron.com/image1.png"
			},{
				"url" : "http://www.dashron.com/image2.png"
			}]
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/


/**
 * Test that functions are properly expanded
 */
exports.testFunctionFilterLiteral = function (test) {
	test.expect(1);

	var filter = new FieldsFilter();
	filter._filterObject({
		"delayed" : true
	}, testResponseObject())
	.then(function (filtered) {
		test.deepEqual({
			"delayed" : "hello"
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that functions are properly expanded
 */
exports.testFunctionFilterObj = function (test) {
	test.expect(1);

	var filter = new FieldsFilter();
	filter._filterObject({
		"delayed_obj" : {
			"test" : true
		}
	}, testResponseObject())
	.then(function (filtered) {
		test.deepEqual({
			"delayed_obj" : {
				"test" : "yeah"
			}
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that functions are properly expanded
 */
exports.testFunctionArrayFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter();
	filter._filterObject({
		"delayed_array" : {
			"name" : true
		}
	}, testResponseObject())
	.then(function (filtered) {
		test.deepEqual({
			"delayed_array" : [{
				"name" : "bob"
			}, {
				"name" : "tom"
			}]
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that promises are properly expanded
 */
exports.testPromiseExpansionFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter();
	filter._filterObject(true, {
		collection : new Promise(function (resolve, reject) {
			var values = [];
			
			for (var i = 0; i < 5; i++) {
				values.push({"hello" : "goodbye"});
			}

			resolve(values);
		})
	})
	.then(function (filtered) {
		test.deepEqual({
			"collection" : [{
				"hello" : "goodbye"
			}, {
				"hello" : "goodbye"
			},{
				"hello" : "goodbye"
			}, {
				"hello" : "goodbye"
			}, {
				"hello" : "goodbye"
			}]
		}, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/

/**
 * Test that true will render the whole response body
 */
exports.testRenderAllFilter = function (test) {
	test.expect(1);

	var filter = new FieldsFilter(testResponseObject());
	filter.filter(true)
	.then(function (filtered) {
		test.deepEqual(testResponseObject(true), filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
};//*/


exports.testNullsPersist = function (test) {
	var response = {
		"a" : null,
		"b" : {
			"c" : null
		}
	};

	var filter = new FieldsFilter(response);

	filter.filter(true)
	.then(function (filtered) {
		test.deepEqual(response, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
}

exports.testEmptyArraysPersist = function (test) {
	var response = {
		"a" : []
	};

	var filter = new FieldsFilter(response);

	filter.filter(true)
	.then(function (filtered) {
		test.deepEqual(response, filtered);
		test.done();
	})
	.catch(function (err) {
		console.log(err.stack);
		test.fail();
		test.done();
	});
}