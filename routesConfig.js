var neighborRoute = require('./routes/neighbor');

module.exports = function(app) {
	
    app.get('/', neighborRoute.mainpage );
    app.post('/addNeighbor', neighborRoute.addNeighbor );
    app.get('/sendSMS', neighborRoute.getSendSMS );
    app.post('/sendSMS', neighborRoute.postSendSMS );
    
    app.get('/sendGroupSMS', neighborRoute.getSendGroupSMS );
    app.post('/sendGroupSMS', neighborRoute.postSendGroupSMS );
    
    app.get('/viewSingleNeighbor/:number', neighborRoute.viewSingleNeighbor );
    app.get('/viewAllMessages', neighborRoute.viewAllMessages );
    app.get('/viewAllNeighbors', neighborRoute.viewAllNeighbors );
    app.get('/deleteNeighbor/:number', neighborRoute.deleteNeighbor );
    app.get('/status', neighborRoute.status );	
	
	
}