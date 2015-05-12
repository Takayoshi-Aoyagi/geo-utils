"use strict";

var async = require("async");
var request = require("request");

var GeoUtils = function () {};

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

module.exports = GeoUtils;
