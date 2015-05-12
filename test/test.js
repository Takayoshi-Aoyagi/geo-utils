var assert = require('assert');
var GeoUtils = require('../lib/geo-utils');

var debug = false;

function log(str) {
    if (debug) {
	console.log(str);
    }
}

describe('GeoUtils', function () {

    it('zip2addr', function (done) {
	GeoUtils.zip2addr('104-0061', function (err, json) {
	    assert.equal("東京都中央区銀座", json.data.fullAddress);
	    done();
	});
    });

    it('addr2geo', function (done) {
	GeoUtils.addr2geo("東京都中央区銀座", function (err, json) {
	    var loc = json.results[0].geometry.location;
	    assert.equal(35.671989, loc.lat);
	    assert.equal(139.763965, loc.lng);
	    done();
	});
    });

    it('zip2geo', function (done) {
	GeoUtils.zip2geo("104-0061", function (err, result) {
	    assert.equal('東京都中央区銀座', result.addr);
	    assert.equal(35.671989, result.geo.lat);
	    assert.equal(139.763965, result.geo.lng);
	    done();
	});
    });


    
});



    
