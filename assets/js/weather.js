var buttonEl = document.querySelector("#btn-search"); // Reference to the #btn

var cityLogEl = document.querySelector("#city-history"); // Reference to the div that will contain the log of cities searched 

var currentCityEl = document.querySelector("#targetCity"); // Reference to the div that will contain the current city searched

var forecastEl = document.querySelector("#infoCity"); // Reference to the div that will contain the forecast

var storeData = JSON.parse(localStorage.getItem('cities')) || []; // Variable for retrieving the data from local storage or array

var urlIcon;
    if (location.protocol === "http:") {
        urlIcon = "http://openweathermap.org/img/wn/";
    } else {
        urlIcon = "http://openweathermap.org/img/wn/";
    }

var currentWeather = []; // Array for the weather conditions of the searched city

// Loads the local storage when page loads
function start() {
    loadWeather();
};

// Function to retrieve the data from localStorage
var loadWeather = function() {
    cleaningEl(cityLogEl);

    // Creates the unordered list to store the data
    if (storeData) {
        var listEl = document.createElement("ul");
        listEl.classList.add("list-unstyled");
        listEl.classList.add("w-100");
    
        // Loop to iterate through localStorage 
        for (var i = 0; i < storeData.length; i++) {
            var listItemEl = document.createElement("li");
            listItemEl.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+storeData[i]+"'>" + storeData[i] + "</button>"; // Creates button with Bootstrap classes
            listEl.appendChild(listItemEl); // Appends new button element to listEl
        }

        cityLogEl.appendChild(listEl); // Appends listEl to the parent div cityLogEl
    }
};

// Listener to call function when a city, in the cityLog, is clicked 
$(document).on("click", ".list-group-item", function(event) {
    event.preventDefault();
    var city = $(this).attr("attr");
    callApi(city);
});

// Clears everything inside container
var cleaningEl = function(element) {
    element.innerHTML = "";
};

// Determins the intensity of the UV index
var determineUV = function(uv) {
    var uvIndex = parseFloat(uv);
    var bgColor; // Variable to hold the background color of the uv index

    if (uvIndex < 3) {
        bgColor = "bg-success"; // Low = Green
    }
    else if (uvIndex < 6) {
        bgColor = "bg-warning"; // Moderate = Yellow
    }
    else if (uvIndex < 8) {
        bgColor = "bg-danger"; // High = Red
    }
    else {
        bgColor = "bg-dark"; // Very High / Extreme = Black
    }

    return bgColor;
};

var weather = function (city, uv) {
    // Clears the containers
    cleaningEl(currentCityEl);
    cleaningEl(forecastEl);

    // Current City
    var city1 = document.createElement("div"); // Div for the City, Date, and Weather
    city1.classList.add("col-6"); // Bootstrap class

    var city2 = document.createElement("div"); // Div for the City, Date, and Weather
    city2.classList.add("col-6"); // Bootstrap class

    var cityEl = document.createElement("h2");
    cityEl.textContent = city + " (" + currentWeather[0].dateT + ")";

    var imageCurrent = document.createElement("img");
    imageCurrent.setAttribute("src", currentWeather[0].icon);
    imageCurrent.classList.add("bg-info"); // Bootstrap class

    city1.appendChild(cityEl);
    city2.appendChild(imageCurrent);

    var weatherStats = document.createElement("div"); // Div containing status on temp, humidity, wind speed, and UV index
    weatherStats.classList.add("col-12");
    weatherStats.innerHTML = "<p> Temperature: " + currentWeather[0].temp + "°F" + "</p>" +
                             "<p> Humidity: " + currentWeather[0].humidity + "% </p>" +
                             "<p> Wind Speed: " + currentWeather[0].speed + " MPH </p>" +
                             "<p>UV index: <span class='text-white "+ determineUV(uv) + "'>" + uv + "</span></p>";

    currentCityEl.appendChild(city1);
    currentCityEl.appendChild(city2);
    currentCityEl.appendChild(weatherStats);

    var fiveDayForecast = document.createElement("div"); // Div that will contain 5 day forecast
    fiveDayForecast.classList.add("row"); // Bootstrap class

    var storeClass = document.createElement("div"); // Div to contain the <h2> header with Bootstrap class col-12 
    storeClass.classList.add("col-12");
    storeClass.innerHTML = "<h2> 5 Day Forecast </h2>";

    fiveDayForecast.appendChild(storeClass);
    forecastEl.appendChild(fiveDayForecast);

    var weatherCard = document.createElement("div"); // Continer that stores the weather cards for 5 day forecast
    weatherCard.classList.add("d-flex");

    // For loop to get information from the currentWeather aray
    for (var i = 1; i < currentWeather.length; i++) {

        var card = document.createElement("div"); // Div for the bootstrap card
        card.classList.add("card");
        card.classList.add("bg-primary");
        card.classList.add("text-white");
        card.classList.add("rounded");
        card.classList.add ("mr-2"); 
        card.classList.add("flex-fill"); // Bootstrap classes for the card

        var cardBody = document.createElement("div"); // Div for card body
        cardBody.classList.add("card-body");

        var cardTitle = document.createElement("h6");
        cardTitle.classList.add("card-title");

        var forecastImg = document.createElement("img");
        cardTitle.textContent = currentWeather[i].dateT;
        forecastImg.setAttribute("src", currentWeather[i].icon);

        var cardText1 = document.createElement("p");
        var cardText2 = document.createElement("p");
        cardText1.classList.add("small");
        cardText1.textContent = " Temperature: " + currentWeather[i].temp + " °F";
        cardText2.classList.add("small");
        cardText2.textContent = "Humidity: " + currentWeather[i].humidity + "%";
        
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(forecastImg);
        cardBody.appendChild(cardText1);
        cardBody.appendChild(cardText2);
        card.appendChild(cardBody);
        weatherCard.appendChild(card);
    }

    forecastEl.appendChild(weatherCard);
};

// Saves the city to localStorage
var savedCity = function (city) {
    var flag = false
    if (storeData) {
        for (var i = 0; i < storeData.length; i++) {
            if (storeData[i] === city) {
                flag = true;
            }
        }

        if (flag) {
            alert("The City: " + city + " already exists");
        }
    }
    if (!flag) {
        storeData.push(city);
        localStorage.setItem("cities", JSON.stringify(storeData));
    }

    loadWeather();
};

var searchDate9AM = function (str) {
    var hour = str.split(" ")[1].split(":")[0];
    var flag = false;
    
    if(hour === "09"){
        flag = true;
    }        
    
    return flag;
};

// Formats the date from default to MM/DD/YYYY
var dateFormat = function (date) {
    var newDate = date.split(" ")[0].split("-");
    return (newDate[1] + "/" + newDate[2] + "/" + newDate[0]);
};

var dataObject = function (list, position) {

    if (currentWeather.length) {
        currentWeather = [];
    }

    var object = {
        dateT: dateFormat(list[0].dt_txt),
        humidity: list[0].main.humidity,
        speed: list[0].wind.speed,
        temp: list[0].main.temp,
        icon: urlIcon + list[0].weather[0].icon + ".png",
        lat: position.lat,
        lon: position.lon 
    };

    currentWeather.push(object);
    
    for(var i = 1; i < list.length; i++) {
        

        if(searchDate9AM(list[i].dt_txt)) {
            object = {
                dateT : dateFormat(list[i].dt_txt),
                humidity : list[i].main.humidity,
                speed: list[i].wind.speed,
                temp: list[i].main.temp,
                icon : urlIcon + list[i].weather[0].icon + ".png",
                lat : position.lat,
                lon: position.lon
            };

            currentWeather.push(object);
        }
    }
};

// Retrieves information about the searched city's weather through openweathermap.org api
var callApi = function (city) {
    var url;

    if (location.protocol === 'http:') {
        url = 'http://api.openweathermap.org/data/2.5/forecast?appid=b68626681235081fcc5ac54d3c685685&units=imperial&q=' + city;
     } else {
        url = 'https://api.openweathermap.org/data/2.5/forecast?appid=b68626681235081fcc5ac54d3c685685&units=imperial&q=' + city;
     }

    fetch(url)
    .then(function(apiResponse) {
        return apiResponse.json();
    })
    .then(function (apiResponse) {
        if (apiResponse.cod != "200") {
            alert("Unable to find " + city + " in OpenWeathermap.org");
            return;
        } else {
            // Send the list array of forecast data and object
            dataObject(apiResponse.list, apiResponse.city.coord);
        }

        var url1;

        if (location.protocol === "http:") {
            url1 = 'http://api.openweathermap.org/data/2.5/uvi?appid=b68626681235081fcc5ac54d3c685685&lat=' + currentWeather[0].lat + '&lon=' + currentWeather[0].lon;
        } else {
            url1 = 'https://api.openweathermap.org/data/2.5/uvi?appid=b68626681235081fcc5ac54d3c685685&lat=' + currentWeather[0].lat + '&lon=' + currentWeather[0].lon;
        }

        fetch(url1)
        .then(function (uvResponse) {
            return uvResponse.json();
        })
        .then(function (uvResponse) {
            if (!uvResponse) {
                alert("OpenWeathermap.org could not find anyting for longitude or latitude");
                return;
            } else {
                savedCity(city);
                weather(city, uvResponse.value);
            }
        })
    })
    .catch(function (error) {
        alert("Unable to connect to OpenWeathermap.org");
        return;
    });
};

// Function that starts on button click
var search = function (event) {
    event.preventDefault();

    var inputEl = document.querySelector("#searchCity");
    var textInput = inputEl.value.trim();

    if (inputEl.value === "") {
        alert("Weather Dash requires you to enter the name of a City!");
        return;
    } else {
        callApi(textInput);
    }
};

// Executing the code
start();
buttonEl.addEventListener("click", search);