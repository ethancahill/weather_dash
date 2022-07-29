const key = '4a94948c09b423a41e87f9c16b95831e'
const searchBtn = document.getElementById('search')
var userInput = document.getElementById('city-search')

async function geoLocate(e) {
    e.preventDefault();

    const locationResponse= await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + userInput.value + '&limit=1&appid=' + key)
   const formattedResponse = await locationResponse.json()
   console.log(formattedResponse)
}

searchBtn.addEventListener('click', geoLocate)