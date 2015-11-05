import isOk from'is-ok';
import $ from 'jquery';
import _ from 'lodash';

let self = undefined;
let DEFAULT_OPTIONS = {
	baseUrl: 'http://localhost:3000',
	timeout: 5000
};

let ApiClient = {
	init: function(options){
		self = this;
		_.extend(this, DEFAULT_OPTIONS, options);

		$.ajaxSetup({
			timeout: options.timeout || 5000,
			dataType: 'json',
			statusCode: {
				500: function(){
					alert('ApiClient: Something happened on the server and we might not be able to complete your request at the moment.');
				}
			}
		});
		
		['get', 'post', 'put', 'del', 'patch'].forEach(function(method){
			self[method] = function(url, body, callback){
				if(!callback && typeof body === 'function'){
					callback = body;
					body = undefined;
				}

				var req = {
					method: method,
					url: self.baseUrl+url,
					data: body
				};

				return $.ajax(req)
					.error(function(res){
						console.log('ApiClient request error', {request: req, response: res});
					});

			};
		});
	}
};

export default ApiClient;