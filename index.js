"use strict";

var url_module = require('url');

var FieldsFilter = module.exports.FieldsFilter = require('./src/fieldsfilter.js');

/**
 * Middleware for automatically applying the fields filter.
 */
module.exports.middleware = function () {
	return function (method, url, body, headers, next) {
		return next()
			.then(function (response) {
				// Apply field filtering and value expansion on the response object
				var filter = new FieldsFilter(response.body);
				return filter.filter(url.query.fields).then(function (filtered_body) {
					response.body = filtered_body;
					return response;
				});
			});
	};
};