const apiKey = "f584ea70adac57960cc99968e9330704";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherBox = document.getElementById("weatherBox");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const themeBtn = document.getElementById("themeBtn");

// Weather Elements
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherType = document.getElementById("weatherType");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const clouds = document.getElementById("clouds");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

// Search Button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city.");
        return;
    }

    getWeather(city);
});

// Press Enter
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// Current Location
locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(async(position)=>{

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        getWeatherByLocation(lat,lon);

    },()=>{
        alert("Location access denied.");
    });

});

// Dark Mode
themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML="☀ Light Mode";
    }else{
        themeBtn.innerHTML="🌙 Dark Mode";
    }

});

// Weather by City
async function getWeather(city){

    loading.classList.remove("hidden");
    weatherBox.classList.add("hidden");
    error.classList.add("hidden");

    try{

        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if(!response.ok){
            throw new Error();
        }

        const data=await response.json();

        displayWeather(data);

    }
    catch{

        error.classList.remove("hidden");

    }

    loading.classList.add("hidden");

}

// Weather by Location
async function getWeatherByLocation(lat,lon){

    loading.classList.remove("hidden");
    weatherBox.classList.add("hidden");
    error.classList.add("hidden");

    try{

        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data=await response.json();

        displayWeather(data);

    }
    catch{

        error.classList.remove("hidden");

    }

    loading.classList.add("hidden");

}

// Display Weather
function displayWeather(data){

    cityName.innerHTML=`${data.name}, ${data.sys.country}`;

    temperature.innerHTML=`${Math.round(data.main.temp)}°C`;

    weatherType.innerHTML=data.weather[0].main;

    feelsLike.innerHTML=`${Math.round(data.main.feels_like)}°C`;

    humidity.innerHTML=`${data.main.humidity}%`;

    wind.innerHTML=`${data.wind.speed} m/s`;

    pressure.innerHTML=`${data.main.pressure} hPa`;

    visibility.innerHTML=`${data.visibility/1000} km`;

    clouds.innerHTML=`${data.clouds.all}%`;

    sunrise.innerHTML=formatTime(data.sys.sunrise);

    sunset.innerHTML=formatTime(data.sys.sunset);

    weatherIcon.src=
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    weatherBox.classList.remove("hidden");

}

// Format Time
function formatTime(time){

    const date=new Date(time*1000);

    return date.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });

}