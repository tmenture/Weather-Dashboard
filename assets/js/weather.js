var buttonEl = document.querySelector("#btn-search"); // Reference to the #btn

var cityLogEl = document.querySelector("#city-history"); // Reference to the div that will contain the log of cities searched 

var currentCityEl = document.querySelector("#targetCity"); // Reference to the div that will contain the current city searched

var forecastEl = document.querySelector("#infoCity"); // Reference to the div that will contain the forecast

var storeData = JSON.parse(localStorage.getItem('cities')) || []; // Variable for retrieving the data from local storage or array

var currentWeather = []; // Array for the weather conditions of the searched city

