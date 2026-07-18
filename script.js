const forecastCards = document.querySelectorAll(".forecast-card");

const apiKey = "f584ea70adac57960cc99968e9330704";

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const dateElement = document.getElementById("date");
const timeElement = document.getElementById("time");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const weatherDesc = document.getElementById("weatherDesc");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const weatherIcon = document.getElementById("weatherIcon");

function updateWeatherIcon(condition){

    if(condition==="Clear")
        weatherIcon.className="fa-solid fa-sun";

    else if(condition==="Clouds")
        weatherIcon.className="fa-solid fa-cloud";

    else if(condition==="Rain" || condition==="Drizzle")
        weatherIcon.className="fa-solid fa-cloud-rain";

    else if(condition==="Thunderstorm")
        weatherIcon.className="fa-solid fa-bolt";

    else if(condition==="Snow")
        weatherIcon.className="fa-solid fa-snowflake";

    else
        weatherIcon.className="fa-solid fa-smog";
}

function updateBackground(condition){

    const body = document.body;

    if(condition === "Clear"){
        body.style.background =
        "linear-gradient(135deg,#f6d365,#fda085)";
    }

    else if(condition === "Clouds"){
        body.style.background =
        "linear-gradient(135deg,#bdc3c7,#2c3e50)";
    }

    else if(condition === "Rain" || condition==="Drizzle"){
        body.style.background =
        "linear-gradient(135deg,#4facfe,#00f2fe)";
    }

    else if(condition==="Thunderstorm"){
        body.style.background =
        "linear-gradient(135deg,#373B44,#4286f4)";
    }

    else if(condition==="Snow"){
        body.style.background =
        "linear-gradient(135deg,#E6DADA,#274046)";
    }

    else{
        body.style.background =
        "linear-gradient(135deg,#2193b0,#6dd5ed)";
    }

}


async function getWeather(city) {

    
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {

        cityName.textContent = "Loading...";
        temp.textContent = "--°C";
        weatherDesc.textContent = "Fetching weather...";
        const response = await fetch(url);
        const data = await response.json();
        console.log(response.status);
        console.log(data);
        if (data.cod != 200) {
            cityName.textContent = "City Not Found";
            temp.textContent = "--°C";
            weatherDesc.textContent = "Please enter a valid city";
            humidity.textContent = "--";
            wind.textContent = "--";
            pressure.textContent = "--";
            visibility.textContent = "--";
            return;
        }

        cityName.textContent = data.name;
        temp.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDesc.textContent = data.weather[0].description;

        humidity.textContent = data.main.humidity + "%";
        wind.textContent = data.wind.speed + " m/s";
        pressure.textContent = data.main.pressure + " hPa";
        visibility.textContent = (data.visibility / 1000) + " km";
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);

        sunrise.textContent = sunriseTime.toLocaleTimeString([], {
        hour: "2-digit",
       minute: "2-digit"
});

sunset.textContent = sunsetTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
});
        
      
      updateWeatherIcon(data.weather[0].main);
      updateBackground(data.weather[0].main);

    // Fetch 5-Day Forecast
    const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
);

const forecastData = await forecastResponse.json();
console.log(data);
updateForecast(forecastData);

    } catch (error) {
        
        
        alert("Something went wrong!");

    }

}

async function getWeatherByCoordinates(lat, lon) {

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        cityName.textContent = data.name;
        temp.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDesc.textContent = data.weather[0].description;

        humidity.textContent = data.main.humidity + "%";
        wind.textContent = data.wind.speed + " m/s";
        pressure.textContent = data.main.pressure + " hPa";
        visibility.textContent = (data.visibility / 1000) + " km";

        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);

    sunrise.textContent = sunriseTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
});

sunset.textContent = sunsetTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
});

        updateWeatherIcon(data.weather[0].main);
        updateBackground(data.weather[0].main);

    } catch (error) {
        
        
        alert("Unable to fetch location weather.");

    }

}


function updateDateTime() {

    const now = new Date();

    const dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    dateElement.textContent = now.toLocaleDateString("en-US", dateOptions);

    timeElement.textContent = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

}

updateDateTime();


setInterval(updateDateTime, 1000);


searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city===""){

        alert("Please enter a city");

        return;
    }

    getWeather(city);
    addToHistory(city);

});

cityInput.addEventListener("keypress", function(event) {

    if(event.key === "Enter"){

        searchBtn.click();

    }

});



getWeather("Lucknow");

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            try {

                const response = await fetch(url);
                const data = await response.json();

                cityName.textContent = data.name;
                temp.textContent = `${Math.round(data.main.temp)}°C`;
                weatherDesc.textContent = data.weather[0].description;

                humidity.textContent = data.main.humidity + "%";
                wind.textContent = data.wind.speed + " m/s";
                pressure.textContent = data.main.pressure + " hPa";
                visibility.textContent = (data.visibility / 1000) + " km";

                updateWeatherIcon(data.weather[0].main);
                updateBackground(data.weather[0].main);

            } catch (error) {

                alert("Unable to fetch location weather.");

            }

        },

        () => {

            alert("Location permission denied.");

        }

    );

});

function updateForecast(data) {

    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    forecastCards.forEach((card, index) => {

        if (!dailyData[index]) return;

        const day = new Date(dailyData[index].dt_txt)
            .toLocaleDateString("en-US", { weekday: "short" });

        const temp = Math.round(dailyData[index].main.temp);

        const icon = dailyData[index].weather[0].main;

        card.querySelector("h4").textContent = day;
        card.querySelector("p").textContent = temp + "°C";

        const iconElement = card.querySelector("i");

        if (icon === "Clear")
            iconElement.className = "fa-solid fa-sun";

        else if (icon === "Clouds")
            iconElement.className = "fa-solid fa-cloud";

        else if (icon === "Rain")
            iconElement.className = "fa-solid fa-cloud-rain";

        else if (icon === "Snow")
            iconElement.className = "fa-solid fa-snowflake";

        else
            iconElement.className = "fa-solid fa-cloud";

    });

}
// ================= CHATBOT =================

const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");

chatToggle.addEventListener("click", () => {
    chatBox.style.display = "flex";
});

closeChat.addEventListener("click", () => {
    chatBox.style.display = "none";
});

const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");
const chatBody = document.getElementById("chatBody");

sendMessage.addEventListener("click", sendChat);

chatInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        sendChat();
    }

});

function sendChat(){

    const message = chatInput.value.trim();

    if(message === "") return;

    chatBody.innerHTML += `
        <div class="user-message">${message}</div>
    `;

    chatInput.value = "";

    setTimeout(() => {

    let reply = "";

    const userText = message.toLowerCase();

    if(userText.includes("hello") || userText.includes("hi")){
        reply = "👋 Hello! How can I help you today?";
    }

    else if(userText.includes("temperature")){
        reply = "🌡️ Current Temperature is " + temp.textContent;
    }

    else if(userText.includes("humidity")){
        reply = "💧 Humidity is " + humidity.textContent;
    }

    else if(userText.includes("wind")){
        reply = "🌬️ Wind Speed is " + wind.textContent;
    }

    else if(userText.includes("pressure")){
        reply = "📊 Pressure is " + pressure.textContent;
    }

    else if(userText.includes("city")){
        reply = "📍 Current City is " + cityName.textContent;
    }

    else if(userText.includes("weather")){
        reply = "☁️ " + weatherDesc.textContent;
    }

    else if(userText.includes("wear") || userText.includes("dress")){

    const temperature = parseInt(temp.textContent);

    if(temperature >= 35){
        reply = "👕 It's very hot. Wear light cotton clothes, sunglasses and drink plenty of water.";
    }
    else if(temperature >= 25){
        reply = "👕 The weather is pleasant. Light casual clothes are a good choice.";
    }
    else{
        reply = "🧥 It's cool outside. Wear a jacket or warm clothes.";
    }

}

else if(userText.includes("umbrella") || userText.includes("rain")){

    if(weatherDesc.textContent.toLowerCase().includes("rain")){
        reply = "☔ Yes! Carry an umbrella because rain is expected.";
    }else{
        reply = "🌤️ No umbrella is needed right now.";
    }

}

else if(userText.includes("travel")){

    if(weatherDesc.textContent.toLowerCase().includes("storm")){
        reply = "⚠️ Travel is not recommended due to stormy weather.";
    }else{
        reply = "🚗 Weather looks good for travelling. Drive safely!";
    }

}

else if(userText.includes("sunscreen") || userText.includes("sun")){

    if(parseInt(temp.textContent) >= 30){
        reply = "🧴 Yes! Use sunscreen and stay hydrated.";
    }else{
        reply = "😊 Sunscreen is optional today.";
    }

}

    else{
        reply = "🤖 Sorry, I don't understand. Try asking about weather, temperature, humidity, wind or pressure.";
    }

    chatBody.innerHTML += `
        <div class="bot-message">${reply}</div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;

},500);
}

// ===== Favorite Cities =====

const favCities = document.querySelectorAll(".favCity");

favCities.forEach(button => {

    button.addEventListener("click", () => {

        const city = button.textContent;

        cityInput.value = city;

        getWeather(city);
        addToHistory(city);

    });

});

// ===== Search History =====

const historyList = document.getElementById("searchHistory");

let searchHistory = [];

function addToHistory(city){

    city = city.trim();

    if(searchHistory.includes(city)){
        searchHistory = searchHistory.filter(item => item !== city);
    }

    searchHistory.unshift(city);

    if(searchHistory.length > 5){
        searchHistory.pop();
    }

    historyList.innerHTML = "";

    searchHistory.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        li.addEventListener("click", () => {

            cityInput.value = item;

            getWeather(item);

        });

        historyList.appendChild(li);

    });

}