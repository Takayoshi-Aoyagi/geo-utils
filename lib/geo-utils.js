"use strict";

var util = require('util');

var async = require("async");
var request = require("request");

var GeoUtils = function () {};

/**
 * Get Address from zip code
 * !!! Japan only !!!
 * @param appid Yahoo! Developer's API key
 * @param zipCode zip code
 * @param callback callback function
 */
GeoUtils.zip2addr = function (appid, zipCode, callback) {
    var options = {
	url: "http://search.olp.yahooapis.jp/OpenLocalPlatform/V1/zipCodeSearch",
	timeout: 10000,
	qs: {
	    appid: appid,
	    output: "json",
	    query: zipCode
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
	timeout: 10000,
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
 *
 * @param appid Yahoo! Developer's API key
 * @param zpiCode zip code
 * @param callback callback function
 */
GeoUtils.zip2geo = function (appid, zipCode, callback) {
    GeoUtils.zip2addr(appid, zipCode, function (err, json) {
	if (err) {
	    callback(err);
	} else if (json && json.Feature && json.Feature[0] && json.Feature[0].Property) {
	    var data = json.Feature[0],
		addr = data.Property.Address,
		loc = data.Geometry.Coordinates.split(",");
	    var result = {
		addr: addr,
		geo: {
		    lat: loc[1],
		    lng: loc[0]
		}
	    };
	    callback(null, result);
	} else {
	    callback("No Address " + zipCode);
	}
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
	timeout: 10000,
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
