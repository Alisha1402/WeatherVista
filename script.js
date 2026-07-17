const forecastCards = document.querySelectorAll(".forecast-card");

const apiKey = "f584ea70adac57960cc99968e9330704";


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

        
      
      updateWeatherIcon(data.weather[0].main);
      updateBackground(data.weather[0].main);

    // Fetch 5-Day Forecast
    const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
);

const forecastData = await forecastResponse.json();

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