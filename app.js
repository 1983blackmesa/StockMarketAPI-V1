var express = require('express');
var bodyParser = require('body-parser');

var app = express();
  
//example
////https://finnhub.io/api/v1/quote?symbol=GOOGL&token=ca7vjaiad3id34o774q0

// Allowing our app to use the body parser package.
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static("public"));

var axios = require("axios").default;
  

app.get("/", function(req, res) {
      res.sendFile(__dirname + "/index.html");
});
  
// HANDLING THE POST REQUEST ON /DATA ROUTE.
app.post("/",  function(req, res) {
	const symbol = req.body.nameOfStock;
	const price = req.body.purchasedPrice;
	const qt = req.body.quantity;

	const upperSymbol = symbol.toUpperCase();
	var options = 'https://finnhub.io/api/v1/quote?' + 'symbol=' + upperSymbol + "&token=ca7vjaiad3id34o774q0";
	

        axios.request(options).then(function (response) {
				const myvar = response.data;
				
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


				
			    res.send();
                console.log(myvar);//test
          
          }).catch(function (error) {
          console.error(error)
          });
});
  
  
var port = 3000;
app.listen(port, function() {
    console.log("Server started successfully at port 3000!");
});