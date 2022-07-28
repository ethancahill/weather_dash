$(function () {
    var formCity = document.querySelector('#search-city')
    var inputCity = document.querySelector('#city-name')
    var apiKey = ('4a94948c09b423a41e87f9c16b95831e')
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) ||
        [];

    const citiesHistory = $('#cities-history');
    for (let i = 0; i < searchHistory.length; i++) {
        const cityName = searchHistory[i];
        addCityHistoryListItem(cityName)
    }
    function addCityHistoryListItem(cityName) {
        var myLi = $("<li></li>");
        var myBtn = $("<button></button>")
        myBtn.text(cityName);
        myLi.append(myBtn);
        myLi.on("click", function (event) {
            inputCity.value = $(this).text()
            formSubmitHandler(event);
        })
        citiesHistory.append(myLi);

    }



    var formSubmitHandler = async function (event) {
       
        event.preventDefault();

     
        var cityName = inputCity.value.trim();

        if (cityName) {
            $("#location").text(cityName);
       
            if (!searchHistory.includes(cityName)) {
                addCityHistoryListItem(cityName);
                searchHistory.push(cityName);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
            }

            var myData = await getCityLocation(cityName);
            var myLng = myData.coord.lon;
            var myLat = myData.coord.lat;

            await getCurrentWeather(myLat, myLng);
            await getDailyWeather(myLat, myLng);
        } else {
            alert('Please enter a city');
        }
    };

   
    var getCityLocation = async function (cityName) {
      
        var weatherMap = 'https://api.openweathermap.org/data/2.5/weather?q=' +
            cityName + '&appid=' + apiKey

        
        return await fetch(weatherMap)
            .then(function (response) {
              
                if (response.ok) {
                  
                    return response.json()
                } else {
                    alert('Error: ' + response.statusText);
                }
            })
    }

    function getWeatherData(lat, lng) {
    
        var newApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +
            lat + '&lon=' + lng +
            '&exclude=hourly&appid=' + apiKey +
            '&units=imperial';

        return fetch(newApiUrl)
            .then(function (response) {
                if (response.ok) {
                    return response.json()
                } else {
                    alert('Error: ' + response.statusText);
                }
            })
    }

    function formatDate(dt) {
        return new Date(dt * 1000).toLocaleDateString(
            'en-us' 
        );
    }


    async function getCurrentWeather(lat, lng) {
   
        var weatherData = await getWeatherData(lat, lng);
        var currentTemp = weatherData.current.temp
        var myWindSpeed = weatherData.current.wind_speed
        var myHumidity = weatherData.current.humidity
        var myUvi = weatherData.current.uvi

        var iconId = weatherData.current.weather[0].icon
     
        var myIconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"
        $("#current-image").attr("src", myIconUrl);

        var formattedDate = formatDate(weatherData.current.dt);
        $("#location-date").text(formattedDate)

        $("#current-temp").text(currentTemp);
        $("#current-wind").text(myWindSpeed);
        $("#current-humidity").text(myHumidity);
        $("#current-uv").text(myUvi);
        if (myUvi <= 2) {
            $("#current-uv").removeClass("medium-uv bad-uv")
            $("#current-uv").addClass("good-uv")
        }
        if (myUvi > 2 && myUvi < 5) {
            $("#current-uv").removeClass("good-uv bad-uv")
            $("#current-uv").addClass("medium-uv")
        }
        if (myUvi >= 5) {
            $("#current-uv").removeClass("medium-uv good-uv")
            $("#current-uv").addClass("bad-uv")
        }
    }

   

    async function getDailyWeather(lat, lng) {
        var weatherData = await getWeatherData(lat, lng);
        console.log(weatherData)
        var forecastContainer = $("#forecast-location");
        forecastContainer.empty();
        for (let i = 1; i < 6; i++) {
            var myWeather = weatherData.daily[i];
            var dateContainer =$("<section class='.col-2'></section>");


            var myh4 = document.createElement("h4");
            myh4.innerHTML = formatDate(myWeather.dt);
            dateContainer.append(myh4)

            var myIcon = $("<img></img>");
            var iconId = myWeather.weather[0].icon

            var myIconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"
            myIcon.attr("src", myIconUrl);
            dateContainer.append(myIcon);

            var myTemp = document.createElement("p");
            myTemp.innerHTML = myWeather.temp.day + " &deg;F"
            dateContainer.append(myTemp);

            var myWindSpeed = document.createElement("p");
            myWindSpeed.innerHTML = myWeather.wind_speed + " MPH"
            dateContainer.append(myWindSpeed);

            var myHumidity = document.createElement("p");
            myHumidity.innerHTML = myWeather.humidity + " %"
            dateContainer.append(myHumidity);

            forecastContainer.append(dateContainer);
        }
    }


    formCity.addEventListener('submit', formSubmitHandler);

});
