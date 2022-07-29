const key = '4a94948c09b423a41e87f9c16b95831e'
const searchBtn = document.getElementById('search-btn')
var userInput = document.getElementById('city-search')
var currentWeatherBox = document.getElementById('todays-weather')
var cityName = document.getElementById('cityname')
var todaysDataBox = document.getElementById('todays-data')
var todaysTemp = document.getElementById('todays-temp')
var todaysWind = document.getElementById('todays-wind')
var todaysHumidity = document.getElementById('todays-humidity')
var todaysUv = document.getElementById('todays-uv')
var todaysIcon = document.getElementById('todays-icon')
var fiveDayForecastDiv = document.getElementById('fiveday')
var todaysWeather = document.getElementById('weather-title')
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
var searchHistoryDiv = document.getElementById('search-history')
var currentCityWeather = {}
var currentCity = ''
var currentState = ''
var currentDate = ''
var fiveDayForecast = []


async function geoLocate(e) {
    e.preventDefault();

    const locationResponse= await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + userInput.value + '&limit=1&appid=' + key)
   const formattedResponse = await locationResponse.json()
   
   todaysForecast(formattedResponse)
   fiveDay(formattedResponse)
}
async function geoLocateHistory(e) {
    e.preventDefault();
 var searchBtnClicked = e.target.id

    const locationResponse= await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + searchBtnClicked + '&limit=1&appid=' + key)
   const formattedResponse = await locationResponse.json()
   
   todaysForecast(formattedResponse)
   fiveDay(formattedResponse)
}

async function todaysForecast(geoData){
var lat = geoData[0].lat
var lng = geoData[0].lon


   var weather = await fetch ('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lng + '&units=imperial&appid=' + key)
    var formattedWeather = await weather.json()
    currentCityWeather = formattedWeather.current

    currentCity = geoData[0].name
    currentState = geoData[0].state
    currentDate = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
    displayTodaysForecast()
    setSearchHistory()
}

function displayTodaysForecast(){
    cityName.innerHTML = "Today's Weather in: " + currentCity + ', ' + currentState + ' ' + currentDate
    todaysTemp.innerHTML = 'Temperature: ' + currentCityWeather.temp
    todaysWind.innerHTML = 'Wind Speed: ' + currentCityWeather.wind_speed
    todaysHumidity.innerHTML = 'Humidity: ' + currentCityWeather.humidity
    todaysUv.innerHTML = 'UV Index: ' + currentCityWeather.uvi
    todaysIcon.src = 'http://openweathermap.org/img/wn/' + currentCityWeather.weather[0].icon + '@2x.png';

    if(currentCityWeather.uvi < 6){
        todaysUv.classList.add('bg-success', 'text-white')
    }
    else if(currentCityWeather.uvi < 8){
        todaysUv.classList.add('bg-warning', 'text-white')
    } else if(currentCityWeather.uvi < 11){
        todaysUv.classList.add('bg-danger', 'text-white')
    } else if(currentCityWeather.uvi > 11)
    todaysUv.classList.add('bg-dark', 'text-white')
}

async function fiveDay(geoData){
    var lat = geoData[0].lat
    var lng = geoData[0].lon

    const fiveDay = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lng + '&units=imperial&appid=' + key)
    var formattedFiveDay = await fiveDay.json()
    fiveDayForecast =  formattedFiveDay.daily
   
    displayFiveDayForecast()

}

function displayFiveDayForecast() {
    const today = new Date ()
    var date = new Date(today)
     

    for (var i = 0; i < 5; i++) {
        var theDate = date.setDate(date.getDate() + i)
       var insertDate = new Date(theDate).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        var iconImage = 'http://openweathermap.org/img/wn/' + fiveDayForecast[i].weather[0].icon + '@2x.png';
      fiveDayForecastDiv.insertAdjacentHTML('afterend', `
      <h2>5 Day Forecast</h2>
      <h3>${insertDate} </h3>
      <img src='${iconImage}'>
      <h5>Humidity: ${fiveDayForecast[i].humidity}</h5>
      <h5>Wind Speed: ${fiveDayForecast[i].wind_speed}</h5>
      <h5>Temperature ${fiveDayForecast[i].temp.day}
      `)  
    }
}

function setSearchHistory(){
    searchHistory.unshift(currentCity)
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
    
    getSearchHistory()
}

function getSearchHistory(){
    for(var i = 0; i < searchHistory.length; i++){
        searchHistoryDiv.insertAdjacentHTML('afterend', `
        
        <Button id="${searchHistory[i]}" class=" btn btn-info m-1">${searchHistory[i]}</Button>

        `)
    }
}


searchBtn.addEventListener('click', geoLocate)
document.getElementById('btn-info').addEventListener('click', geoLocateHistory)