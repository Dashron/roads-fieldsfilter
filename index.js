"use strict";

var url_module = require('url');

module.exports.FieldsFilter = require('./lib/fieldsfilter.js');

/**
 * Helper function to replace roads.api.server. This one automatically incorporates the fields filtering
 * 
 * @param  IncomingMessage http_request
 * @param  ServerResponse http_response
 */
module.exports.server = function (http_request, http_response) {
	var api = this;
	var body = '';

	var url = http_request.url;
	var params = url_module.parse(url, true).query;
	
	if (typeof params.fields !== "undefined" && params.fields !== null) {
		params.fields = params.fields.split(',');
	} else {
		params.fields = true;
	}

	http_request.on('readable', function () {
  		var chunk;
		while (null !== (chunk = http_request.read())) {
			body += chunk;
		}
	});

	var writeResponse = function (response) {
		var filter = new module.exports.FieldsFilter(response.data);

		filter.filter(params.fields)
			.then(function (data) {
				response.data = data;
				
				console.log(response.data);
				// wrap up and write the response to the server
				response.writeToServer(http_response);

				// easy curl terminal readout
				if (http_request.headers['user-agent'] && http_request.headers['user-agent'].indexOf('curl') !== -1) {
					http_response.write("\n");
				}

				http_response.end();
			});
	};

	http_request.on('end', function () {
		// execute the api logic and retrieve the appropriate response object
		api.request(http_request.method, http_request.url, body, http_request.headers)
			.then(writeResponse);
	});

	// server request errors go to the unknown error representation
	http_request.on('error', function (err) {
		// todo: this all kinda sucks. It needs a refactor
		console.log(err);
		(new roads.Response({"error" : "An unknown error has occured"}, 500)).writeToServer(http_response);
	});
};