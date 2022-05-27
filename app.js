var express = require('express');
var bodyParser = require('body-parser');

var app = express();
  
//example
////https://finnhub.io/api/v1/quote?symbol=GOOGL&token=YOUR_TOKEN

// Allowing our app to use the body parser package.
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static("public")); //put CSS and images in the public folder

var axios = require("axios").default;
  

app.get("/", function(req, res) {
      res.sendFile(__dirname + "/index.html"); //start on main page index.html
});
  
// HANDLING THE POST REQUEST ON /DATA ROUTE.
app.post("/",  function(req, res) {
	const symbol = req.body.nameOfStock; //get name of stock from users input
	const price = req.body.purchasedPrice; //get price of stock purchased from users input
	const qt = req.body.quantity; //get quantity of stock purchased from users input

	const upperSymbol = symbol.toUpperCase(); //convert to all uppercase to send to finnhub API
	var options = 'https://finnhub.io/api/v1/quote?' + 'symbol=' + upperSymbol + "&token=YOUR_TOKEN"; //concate URL, Symbol, TOKEN
	

        axios.request(options).then(function (response) { //make axios call
				const myvar = response.data; //store our call in a variable
				
				const totalPastPrice = parseInt(price) * parseInt(qt);
				const totalCurrentPrice = parseInt(myvar.c) * parseInt(qt);
				const balance = totalCurrentPrice - totalPastPrice;

				res.write("<p>You have choosen " + upperSymbol + " stock" + "<p>");
				res.write("<p>The Current price of " + upperSymbol + " is " + myvar.c + "<p>");

				if (balance > 0) {
					let percentage = (
						(parseInt(qt) / parseInt(price)) *
						100
					  ).toFixed(2);
					  res.write(`You made a profit of ${percentage} which amounts to $ ${balance} `);
					} //end if balance > 0 

					else if (balance < 0) {
						let percentage = (
						  (parseInt(price) / parseInt(qt)) * 100).toFixed(2);
						res.write(`You made a loss of ${percentage}% which amounts to $${-balance} `);
					}
					
					else {
						res.write("You made neither a profit nor a loss.");
					}


				
			    res.send(); //send to browser
                console.log(myvar);//test
          
          }).catch(function (error) {
          console.error(error) //catch if there was a axios ERROR to API
          });
});
  
  
var port = 3000;
app.listen(port, function() {
    console.log("Server started successfully at port 3000!");
});
