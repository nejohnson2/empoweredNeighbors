var db = require('../accessDB');

// Twilio
var Twilio = require('twilio-js');
Twilio.AccountSid = "ACad716cc4da934be6ad19bf5353312248";
Twilio.AuthToken  = "3af91684fa2d040f587bf96955cffd82";

module.exports = {
	
	mainpage : function(request, response){
		
		var templateData = {
			pageTitle : 'Empowered Neighbors'
		};

		response.render('main.html', templateData);
	},
	
	addNeighbor : function(request, response) {
		
		
		
	},
	
	viewAllMessages : function(request, response) {
		
		
		response.send("hello");
	},
	
	viewSingleNeighbor : function(request, response) {
		var singleNeighbor = request.params.number
	
		db.Neighbor.find({number : singleNeighbor}, function(err, neighbors) {
			
			if (err) {
				console.log(err);
				response.send("an error occured");				
			}
			
			templateData = {
				//layout : 'layout_single_entry.html',
				Neighbor : neighbors
			};
			
			response.render('single_neighbor.html', templateData);
		})
	},
	
	viewAllNeighbors : function(request, response) {
		db.Neighbor.find({}, function(err, neighbors) {
		            
            if (err) {
                console.log(err);
                response.send("an error occurred");
            }
            
            templateData = {
	        	Neighbor : neighbors
			};
            
            response.render('number_single_entry.html',templateData);
            
        })
	},
	
	individualNeighbor : function(request, response) {
		
	
		db.Neighbor.findOne({}, function(err, neighbors) {
			if (err) {
				conole.log(err);
				response.send("an erro occurred");
			}	
			
			templateData = {
				Neighbor : neighbors
			};
		})
		
	},
	
	getSendSMS : function(request, response) {

		// This is a form to imitate information from an SMS
		response.send('<form method="POST" action="/sendSMS">' +
						'Body: <input type="text" name="Body" />' +	
						'who is it going to: <input type="text" name="From" />' +	
						'Twilio Number: <input type="text" name="To" />' +									
						'<input type="submit" />'+
						'</form>');	
		
	},
	
	postSendSMS : function(request, response) {
		var from = request.body.From;
		var to = request.body.To;
		var message = "this is a test";

		Twilio.SMS.create({to: from, from: to, body: message}, function(err,response) {
			console.log('Up Up and Away...SMS Sent!');
		});	
		
		response.redirect('/viewAllNeighbors')
	},
	
	getSendGroupSMS : function(request, response) {
		// This is a form to imitate information from an SMS
		response.send('<form method="POST" action="/sendGroupSMS">' +
						'Body: <input type="text" name="Body" />' +	
						'who is it going to: <input type="text" name="From" />' +	
						'Twilio Number: <input type="text" name="To" />' +									
						'<input type="submit" />'+
						'</form>');	
	},
	
	postSendGroupSMS : function(request, response) {
		var from = request.body.From;
		var to = request.body.To;
		var message = ['hello 1', 'hello 2', 'hello 3']

		for(i=0; i<message.length; i++){
			Twilio.SMS.create({to: from, from: to, body: message[i]}, function(err,response) {
				console.log('Up Up and Away...SMS Sent!');
			});			
		};
		
		response.redirect('/viewAllNeighbors')
	},
	
	deleteNeighbor : function(request, response) {
	
		var numberTo = request.params.number;
		var query = db.Neighbor.remove( {number : numberTo});
	
		query.exec(function (err, specificNumber){
			response.redirect('/viewAllNeighbors');
		});
		
		
	},
	
	status : function(request, response) {
		
		
	},
		
	
	
}