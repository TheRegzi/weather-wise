
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


async function fetchWeatherData(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/metno?latitude=59.9127&longitude=10.7461&current=temperature_2m,apparent_temperature,is_day,rain,showers,snowfall,wind_speed_10m&hourly=temperature_2m,apparent_temperature,rain,snowfall&timezone=auto`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch weather:', error);
    }
}


function displayWeather(data) {
    const weatherDiv = document.getElementById('weatherDetails');
    const current = data.current; 
    weatherDiv.innerHTML = `
        <p>Temperature: ${current.temperature_2m}°C</p>
        <p>Apparent Temperature: ${current.apparent_temperature}°C</p>
        <p>Rain: ${current.rain} mm</p>
        <p>Showers: ${current.showers} mm</p>
        <p>Snowfall: ${current.snowfall} mm</p>
        <p>Wind Speed: ${current.wind_speed_10m} m/s</p>
    `;
}


async function handleWeatherDetails() {
    const name = getQueryParam('name');
    const latitude = getQueryParam('latitude');
    const longitude = getQueryParam('longitude');
    if (name) {
        document.getElementById('placeName').textContent = name;
    }
    if (latitude && longitude) {
        const weatherData = await fetchWeatherData(latitude, longitude);
        if (weatherData) {
            displayWeather(weatherData);
        }
    }
}


handleWeatherDetails();