const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); // body-parser allows to look through the body of the post request and fetch the data based on the name of the input.

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

  res.sendFile(__dirname + "/index.html");

});

app.post("/", function(req, res){

  const query = req.body.cityName;
  const units = "metric";
  const apiKey = "7eb471fba1910c334b8a86a3445b2235";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +query+ "&units=" +units+ "&appid=" +apiKey;

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){  //getting hold of the data from the other server
      const weatherData = JSON.parse(data); //converting from hexadecimal format to JS object
      const temp = weatherData.main.temp; // getting just the temprature value from the data
      const feelsLike = weatherData.main.feels_like;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;

      var desc = weatherData.weather[0].description;
      desc = desc.slice(0,1).toUpperCase() + desc.slice(1,desc.length).toLowerCase(); // making the first letter uppercase

      const icon = weatherData.weather[0].icon;
      const imgURL = "http://openweathermap.org/img/wn/" +icon+ "@2x.png"; //this is the image url

      res.write ("<h1>Temperature in " +query+ ": " +temp+ "&#8451;</h1>");
      res.write ("<h3>Feels like: " +feelsLike+ "&#8451;</h3>");
      res.write ("<p>Humidity: " +humidity+ "%</p>");
      res.write ("<p>Wind Speed: " +windSpeed+ " meter/sec</p>");
      res.write("<p>Condition: " +desc+ "</p>")
      res.write("<img src=" +imgURL+ ">");
      res.send(); //sending data to the client
    });
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server has started successfully");
});
