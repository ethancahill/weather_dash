const key = '4a94948c09b423a41e87f9c16b95831e'
const searchBtn = document.getElementById('search-btn')
var userInput = document.getElementById('city-search')
var currentCityWeather = {}
var currentCity = ''


async function geoLocate(e) {
    e.preventDefault();

    const locationResponse= await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + userInput.value + '&limit=1&appid=' + key)
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
    currentCity = formattedWeather.name
    
}

async function fiveDay(geoData){
    var lat = geoData[0].lat
    var lng = geoData[0].lon
}

searchBtn.addEventListener('click', geoLocate)