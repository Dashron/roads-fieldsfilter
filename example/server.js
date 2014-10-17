"use strict";

var Promise = require('bluebird');

// bluebird 2.0 took array yields out of the standard library, so we have to re-implement it here. It is not used in roads, just the examples
Promise.coroutine.addYieldHandler(function(yieldedValue) {
    if (Array.isArray(yieldedValue)) return Promise.all(yieldedValue);
});

var roads = require('roads');
var fieldsfilter = require('../index');

var api = new roads.API(require('./resources/root').main);

api.onRequest(function (method, url, body, headers, next) {
	// kill trailing slash as long as we aren't at the root level
	if (url.path !== '/' && url.path[url.path.length - 1] === '/') {
		return new roads.Response(null, 302, {
			location : url.path.substring(0, url.path.length - 1)
		});
	}
	
	return next();
});//*/

require('http').createServer(fieldsfilter.server.bind(api))
	.listen(8081, function () {
		console.log('server has started');
	});
