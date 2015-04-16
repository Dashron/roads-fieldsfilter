"use strict";

var roads = require('roads');
var fieldsfilter = require('../index');

var api = new roads.Road(require('./resources/root').main);

api.use(fieldsfilter.middleware());
api.use(roads.middleware.killSlash);//*/


require('http').createServer(api.server.bind(api))
	.listen(8081, function () {
		console.log('server has started');
	});
