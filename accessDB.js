// Module dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

require('./models/neighbor').configureSchema(Schema, mongoose);

var Neighbor = mongoose.model('Neighbor');

module.exports = {
	
	Neighbor : Neighbor,
	
	startup: function(dbToUse) {
		mongoose.connect(dbToUse);
		
		mongoose.connection.on('open', function() {
			console.log("we have connection");
		});
		
	},
	
	getNeighbors: function(callback) { 
	  Neighbor.find({}, ['to'], function(err, neighbors) {
    	  callback(null, neighbors);
      });
		
	},
	
}