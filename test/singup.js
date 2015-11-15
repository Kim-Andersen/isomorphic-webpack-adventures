'use strict';

var chai = require('chai'),
		request = require('request'),
		_ = require('lodash'),
		assert = chai.assert,
		expect = chai.expect,
		should = chai.should();
		

describe('Signup API', function() {

	var API_ROOT = 'http://localhost:3000/api';

	var user = {
		email: 'kimandersen1@gmail.com',
		username: 'kim',
		password: '12345678'
	}

	describe('/signup', function(){
		it('should return 400 when signing up with missing field', function(done){
			request.post(API_ROOT+'/signup', {form: _.pick(user, 'username', 'email')}, 
				function (error, response, body){
			  	should.not.exist(error);
			    expect(response.statusCode).to.equal(400);
			    done();
			  });
		})
		it('should return 409 when signing up with taken email', function(done){
			request.post(API_ROOT+'/signup', {form: user}, 
				function (error, response, body){
			  	should.not.exist(error);
			    expect(response.statusCode).to.equal(409);
			    done();
			  });
		})
	})

  describe('/signup/email_available', function () {
  	it('should return status 200 and available = boolean', function (done) {
		  request.get(API_ROOT+'/signup/email_available/'+user.email, {json: true}, 
		  	function (error, response, body){
			  	should.not.exist(error);
			    expect(response.statusCode).to.equal(200);
			    expect(body.available).to.be.a('boolean');
			    done();
			  });
		});
	});

	describe('/signup/username_available', function () {
  	it('should return status 200 and available = boolean', function (done) {
		  request.get(API_ROOT+'/signup/username_available/'+user.username, {json: true}, 
		  	function (error, response, body){
			  	should.not.exist(error);
			    expect(response.statusCode).to.equal(200);
			    expect(body.available).to.be.a('boolean');
			    done();
			  });
		});
	});

});