var fs = require('fs');
var csvFile = fs.readFileSync("friend_list.csv", "utf-8");
var csv_data= csvParse(csvFile);



function csvParse(csvFile){

var totalArray = csvFile.split("\n"); //split up the array by the new line
var headings= totalArray.splice(0,1);  
headings= headings.toString().split(",");  // convert undefined variables to string, and then split them up by comma
var rows= totalArray.toString().split(","); //convert undefined variables to string, and then split them up by comma 
var numOfHeadings= headings.length; //number of columns
var count=0; //used in for loop 
var collection=[]; //store collection of friends
///for loop is used to remove any empty elements caused by line breaks
for (var i =0; i<=rows.length-1; i++)
{
	if (rows[i]=="")
	{
		var index = rows.indexOf(rows[i]);
		rows.splice(index,1);
	}
}
var numberOfPeople=rows.length/numOfHeadings; //store the number of friends 

for (var p=0;p<numberOfPeople;p++)
		{
			collection[p]=new Object();  //create new Object for each person and store it in collection[]
				
			for (var i=0; i<=headings.length-1; i++) //iterate through each column
				{
					var a=headings[i];
	
  					 for (var j=count; j<count+1; j++)  //while less then the stored value of count
  						 {
   	 						var b= rows[j];    //assign b that specific data value
  				 		  }

   				collection[p][a]=b; //assign value to column;
				count++;
				}
		}
console.log(collection);
return(collection);
}

