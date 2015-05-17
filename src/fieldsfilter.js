"use strict";

/**
* fieldsfilter.js
* Copyright(c) 2014 Aaron Hedges <aaron@dashron.com>
* MIT Licensed
 */

/**
 * Create a field filter object with the response data from the API
 * @param dynamic data
 */
var FieldsFilter = module.exports = function FieldsFilter(data) {
	this._data = data;
};

FieldsFilter.prototype._data = null;

/**
 * Reduce the data associated with this filter object to only contain the fields provided in the "fields" array
 * 
 * @param  Array fields a list of fields which use periods to determine a heirarchy of data
 * @return dynamic
 */
FieldsFilter.prototype.filter = function filter (fields) {
	// If the fields provided was an array, we should turn it into the necessary fields object
	if (Array.isArray(fields)) {
		fields = this._expandFields(fields);
	} else if (typeof fields === "string") {
		fields = this._expandFields(fields.split(','));
	}

	return this._filter(fields, this._data);
};

/**
 * [_filter description]
 * @type {[type]}
 */
FieldsFilter.prototype._filter = function _filter (fields, data) {
	if (typeof fields === "undefined") {
		fields = true;
	}
	var _self = this;

	// handle promises early. Has to happen here so the type checks get the proper object
	return Promise.resolve(data)
	.then(function (resolved_data) {

		if (Array.isArray(resolved_data)) {
			// if array, check each value
			return _self._filterArray(fields, resolved_data);
		} else if (typeof(resolved_data) === "function") {
			// Expand the function and then filter the contents
			return _self._filter(fields, resolved_data());
		} else if (resolved_data === null) {
			// expand nulls, since typeof(null) === "object"
			return null;
		} else if (typeof(resolved_data) === "object") {
			// if object, recurse. Since fields always end with "true", true means "show everything else"
			return _self._filterObject(fields, resolved_data);
		} 

		// if the data is primitive, assign it directly
		return resolved_data;
	});
};

/**
 * For each field in the object, only keep those deemed "valid" from the fields object
 * 
 * @param  Object fields
 * @param  Object data
 * @return Promise
 */
FieldsFilter.prototype._filterObject = function filterObject (fields, data) {
	var new_data = {};
	var field_keys = null;
	var obj_values = [];

	// if fields is true, we want to display and expand every value
	if (fields === true || typeof fields === "undefined") {
		field_keys = Object.keys(data);
	} else {
		field_keys = Object.keys(fields);
	}
	for (let i = 0; i < field_keys.length; i++) {
		obj_values.push(this._filter(fields === true ? fields : fields[field_keys[i]], data[field_keys[i]]));
	}

	return Promise.all(obj_values)
		.then(function (values) {
			var obj = {};

			for (let i = 0; i < values.length; i++) {
				if (values[i] !== undefined) {
					obj[field_keys[i]] = values[i];
				}
			}

			return Object.keys(obj).length ? obj : null;
		});
};

/**
 * For each value of the array, only keep those fields deemed "valid" from the fields object
 * 
 * @param  Object fields parsed fields
 * @param  Array value  data to limit
 * @return Array
 */
FieldsFilter.prototype._filterArray = function filterArray (fields, value) {
	var final_array = [];
	var filtered_value = null;

	for (var i = 0, val_len = value.length; i < val_len; i++) {
		// filter each item in the array with the current level of requested fields
		filtered_value = this._filter(fields, value[i]);

		// if we actually received data, we add it to the array, otherwise don't bother.
		if (filtered_value) {
			final_array.push(filtered_value);
		}
	}

	// if we didn't build an array, return null instead of an empty array
	if (!final_array.length) {
		return [];
	}

	// Handle thenables in the array
	return Promise.all(final_array).then(function (response) {
		return response;
	});
};

/**
 * Turn an array of fields (with periods determining heirarchy) and turn it into a series of objects
 * accurately representing the final structure
 * 
 * @param  Array fields
 * @return Object
 */
FieldsFilter.prototype._expandFields = function expandFields (fields) {
	var data = {};

	// for each field
	for (var i = 0, field_len = fields.length; i < field_len; i++) {
		// split on periods
		var parts = fields[i].split('.');
		var subpart = data;

		// for each part of a period separated field heriarchy
		for (var j = 0, parts_len = parts.length; j < parts_len; j++) {
			// build an object matching that heirarchy
			if (j === parts_len - 1) {
				subpart[parts[j]] = true;
				continue;
			}

			if (!subpart[parts[j]]) {
				subpart[parts[j]] = {};
			}

			subpart = subpart[parts[j]];
		}
	}

	return data;
};
