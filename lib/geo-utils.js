"use strict";

var util = require('util');

var async = require("async");
var request = require("request");

var GeoUtils = function () {};

/**
 * Get Address from zip code
 * !!! Japan only !!!
 * @param zipCode zip code
 * @param callback callback function
 */
GeoUtils.zip2addr = function (zipCode, callback) {
    var options = {
	url: "http://api.zipaddress.net",
	qs: {
	    zipcode: zipCode
	}
    };
    request(options, function (err, res, data) {
	var json = JSON.parse(data);
	callback(err, json);
    });
};

/**
 * Get geo coodinates from address, via Google Maps API
 * @param addr address
 * @param callback callback function
 */
GeoUtils.addr2geo = function (addr, callback) {
    var options = {
	url: "http://maps.googleapis.com/maps/api/geocode/json",
	qs: {
	    address: addr,
	    sensor: false,
	    language: "ja"
	}
    };
    request(options, function (err, res, data) {
	var json = JSON.parse(data);
	callback(err, json);
    });
};

/**
 * zip code to coordinates
 * @param zpiCode zip code
 * @param callback callback function
 */
GeoUtils.zip2geo = function (zipCode, callback) {
    async.waterfall([
	function (cb) {
	    GeoUtils.zip2addr(zipCode, function (err, json) {
		if (err) {
		    cb(err);
		} else if (json && json.data) {
		    cb(null, json.data.fullAddress);
		} else {
		    cb("No Address " + zipCode);
		}
	    });
	}, function (addr, cb) {
	    GeoUtils.addr2geo(addr, function (err, json) {
		var result;
		if (err) {
		    cb(err);
		} else if (json && json.results && json.results[0] && json.results[0].geometry) {
		    result = {
			addr: addr,
			geo: json.results[0].geometry.location
		    };
		    cb(null, result);
		} else {
		    cb("No Geo Location data");
		}
	    });
	}
    ], function (err, result) {
	callback(err, result);
    });
};

/**
 * Get route information via Google Maps API
 * @param origin coordinates of origin
 * @param dst coordinates of destination
 * @param callback callback function
 */
GeoUtils.route = function (origin, dst, callback) {
    var options = {
	url: "http://maps.googleapis.com/maps/api/directions/json",
	qs: {
	    origin: util.format("%s,%s", origin.latitude, origin.longitude),
	    destination: util.format("%s,%s", dst.latitude, dst.longitude),
	    sensor: false,
	    mode: "driving"
	}
    };
    request(options, function (err, res, data) {
	var json = JSON.parse(data);
	callback(err, json);
    });
};

module.exports = GeoUtils;
