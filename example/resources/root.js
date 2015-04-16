"use strict";

var roads = require('roads');
var exampleRepresentation = require('../representations/example.js');
var subRepresentation = require('../representations/sub.js');

/**
 * [one description]
 * @type {Resource}
 */
module.exports.sub = new roads.Resource({
	methods : {
		GET : function (url, body, headers) {
			return new roads.Response(subRepresentation());
		}
	}
});

/**
 * [one description]
 * @type {Resource}
 */
module.exports.main = new roads.Resource({
	resources : {
		'sub' : module.exports.sub
	},
	methods : {
		GET : function (url, body, headers) {
			return new roads.Response(exampleRepresentation.call(this));
		}
	}
});