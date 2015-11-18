import _ from 'lodash'
import fetch from 'isomorphic-fetch'

let self = undefined;
let DefaultOptions = {
	baseUrl: 'http://localhost:3000/api',
	timeout: 5000,
	headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};

let ApiClient = {
	init: function(options){
		self = this
		self.opt = _.extend({}, DefaultOptions, options)

		_.forEach(['get', 'post', 'put', 'del', 'patch'], function(method){
			self[method] = function(uri, body, callback){
				if(!callback && typeof body === 'function'){
					callback = body;
					body = undefined;
				}

				console.log('body', )

				let opt = {
					method: method.toUpperCase(),
					body: JSON.stringify(body),
					headers: self.opt.headers
				}
				  
				return fetch(self.opt.baseUrl+uri, opt)
					.then(self.checkStatus)
				  .then(self.parseJSON)
				  .then(function(data) {
				    console.log('request succeeded with JSON response', data)
				    return data
				  }).catch(function(error) {
				    console.log('request failed', error)
				    return error
				  })
			};
		});
	},

	checkStatus: function(response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response
	  } else {
	    var error = new Error(response.statusText)
	    error.response = response
	    throw error
	  }
	},

	parseJSON: function(response) {
	  return response.json()
	}
};

export default ApiClient;