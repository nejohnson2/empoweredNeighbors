/*
jQuery(document).ready( function() {
	jQuery("button#buildingBtn1").click( getNeighbors );
});

var getNeighbors = function(e) {
	
	var jsonURL = "/viewAllNeighbors";
	
	jQuery.ajax({
	
		url : jsonURL,
		dataType : 'json',
		type : 'GET',
		
		success : function(data) {
			console.log("inside success callback");
			console.log(data);
			if(data.status == "OK") {
				posts = data.posts;
				
				buildNeighborList(posts);
				
			}
		},
		error : function(err) {
			console.log("error fetching posts");
		}
	});
}

var buildNeighborList = function(blogpostsArray) {
	
    // generate html for new comment
    var commentHTML = "<div class='comment'><p>";
    commentHTML += "<b>" + commentData.name + " said</b><br>";
    commentHTML += commentData.text;
    commentHTML += "<br><small>right now!</small>";
    commentHTML += "</p></div>";
    
    //append new comment to DOM (rendered browser html)
    jQuery("div#commentsContainer").append(commentHTML);
    
	
}


*/
