var fs = require('fs');
var csvFile = fs.readFileSync("friend_list.csv", "utf-8");
var csv_data= csvParse(csvFile);
var emailTemplate = fs.readFileSync("email_template.html", "utf-8");
var ejs= require('ejs');
var tumblr=require('tumblr.js');
var moment=require('moment');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('AadRBHHVxNrIYGAING8vQw');




function csvParse(csvFile){
    var arrayOfObjects = [];
    var arr = csvFile.split("\n"); // split will take a string and make it an array ['Keys ', 'contact 1  info', con]
    // "name, email, otherInfo",
    // "Scott, 
    var newObj;
    var keys = arr.shift().split(","); // ["name" , "last name", "email"]
  
    for (var i =0; i<=arr.length-1; i++)
{
	if (arr[i]=="")
	{
		var index = arr.indexOf(arr[i]);
		arr.splice(index,1);
	}
}

    arr.forEach(function(contact){
        contact = contact.split(",");
        newObj = {};

        for(var i =0; i < contact.length; i++){
            newObj[keys[i]] = contact[i];
        }


        arrayOfObjects.push(newObj);

    })

    return arrayOfObjects;
}/////////////////////////end of csvParse function

var friendList = csvParse(csvFile); //get array of contacts

//Tumbler API
// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'Z6Mv14vBMoBpXp9SagfYvAp3C4qw6ZgDOt6YR6yWJFcxtUzDlT',
  consumer_secret: 'DSQElw5iCJsl783aIvnZ1xexhmcdtYy540fesFvqGzQhGIKSx1',
  token: '3q1gbV8fm3g6C3wIYIPB3ffp5Ajwdv9sPXoVB4b4Tv0BBeIWis',
  token_secret: 'RhD0WSrYWEop0lTJpj8TOj4e0EU7oHaL1Oc2KcKTDlBFQFbtnh'
});

client.posts('jsflow.tumblr.com', function(err, blog){
  var latestPosts = []; //array to store posts
  var pastWeek= moment().subtract(7,'days').calendar(); //used Moment to get date from week ago.
  
  //iterate through each blog post
  blog.posts.forEach(function(post){ 
  		
  		var postWritten=moment(post.date,'YYYY-MM-DD hh:mm:ss');
 		//  code to test if it is a week old, if less than week old, push it in the latestPost array.
		if (moment(postWritten).isAfter(pastWeek)){
				latestPosts.push(post); 
			}	
		else{
			console.log("older then 7 days");
		}
  });

var newObj={};

friendList.forEach(function(row){

    var firstName = row["firstName"];
    var numMonthsSinceContact = row["numMonthsSinceContact"];
    var email=row['emailAddress'];
    
    newObj['firstName'] = firstName;
    newObj['numMonthsSinceContact']=numMonthsSinceContact;
    newObj['latestPosts'] = latestPosts;

   var customizedTemplate=ejs.render(emailTemplate, {firstName: firstName, numMonthsSinceContact:numMonthsSinceContact, latestPosts: latestPosts });
   
   sendEmail(firstName,email,'Andrew','amejia49@gmail.com','Hey Guys!',customizedTemplate);

});

});


//Mandril API function
function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
         console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }






