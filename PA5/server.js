var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk'); 
AWS.config.update({region: 'us-east-1'})


var ddb = new AWS.DynamoDB()
var dc = new AWS.DynamoDB.DocumentClient()
var table = 'api-cache'

var app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.post('/dist', bodyParser.json(), function (req, res, next) {
	origin = req.body.origin
	dest = req.body.destination 

	dc.get({
		TableName: table,
		Key: {'args': origin+dest}
	}, function(err, data) {
		if (err) {
			console.log(err)
		} else {
			if ('Item' in data) {
				console.log('Cache Hit')
				res.json({dist: data.Item.dist})
			} else {
				console.log('Cache Miss')
				request('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + dest, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						r = JSON.parse(body)
						r = r.routes[0].legs[0].distance.text

						dc.put({
							TableName:table,
							Item:{
								args:origin+dest,
								dist:r
							}
						}, function(err, data){
							if (err) {
								console.log(err)
							}
						})
						res.json({dist: r})
					} 
				});
			}
		}
	})
	
});

app.listen(3000);
console.log("Server running on port 3000");
