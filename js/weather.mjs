
const latitude = getQueryParam('latitude');
const longitude = getQueryParam('longitude');

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


async function fetchWeatherData(latitude, longitude) {


    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,rain,snowfall,weathercode`;

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

const weatherCodeMap = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: Light',
    53: 'Drizzle: Moderate',
    55: 'Drizzle: Dense',
    56: 'Freezing Drizzle: Light',
    57: 'Freezing Drizzle: Dense',
    61: 'Rain: Slight',
    63: 'Rain: Moderate',
    65: 'Rain: Heavy',
    66: 'Freezing Rain: Light',
    67: 'Freezing Rain: Heavy',
    71: 'Snowfall: Slight',
    73: 'Snowfall: Moderate',
    75: 'Snowfall: Heavy',
    77: 'Snow grains',
    80: 'Rain showers: Slight',
    81: 'Rain showers: Moderate',
    82: 'Rain showers: Violent',
    85: 'Snow showers: Slight',
    86: 'Snow showers: Heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};



function displayDetails(data) {
    const weatherDiv = document.getElementById('essentialDetails');
    const hourlyData = data.hourly || {};
    
    const currentTemperature = hourlyData.temperature_2m ? hourlyData.temperature_2m[0] : 'N/A'; 
    const windSpeed = hourlyData.wind_speed_10m ? hourlyData.wind_speed_10m[0] : 'N/A'; 
    const rain = hourlyData.rain ? hourlyData.rain[0] : 'N/A'; 
    const snowfall = hourlyData.snowfall ? hourlyData.snowfall[0] : 'N/A';
    const screenWidth = window.innerWidth;
    const weatherCode = hourlyData.weathercode ? hourlyData.weathercode[0] : 'N/A'; 
    const weatherDescription = weatherCodeMap[weatherCode] || 'Unknown';

    
    let weatherHtml = `
    <div class="topofpage">
        <div class="temperature">
            <span class="now">Now</span> 
            <span class="degree"><i class="fa-solid fa-temperature-three-quarters"></i>${currentTemperature}°</span>
        </div>
        <div class="topDetails">
            <span class="topIcons"><i class="fa-solid fa-wind"></i></span> 
            <span class="wind-degree">${windSpeed} m/s</span>
        </div>
        <div class="topDetails">
            <span class="topIcons"><i class="fa-solid fa-umbrella"></i></span> 
            <span class="rain-amount">${rain} mm</span>
        </div>
        <div class="topDetails">
            <span class="topIcons"><i class="fa-solid fa-snowflake"></i></span> 
            <span class="snow-amount">${snowfall} cm</span>
        </div>
    </div>
    `;

   

    weatherDiv.innerHTML = weatherHtml;
}

function displayWeather(data) {
    const essentialDiv = document.getElementById('weatherDetails');
    const hourlyData = data.hourly || {};
    const currentTemperature = hourlyData.temperature_2m ? hourlyData.temperature_2m[0] : 'N/A';
    const windSpeed = hourlyData.wind_speed_10m ? hourlyData.wind_speed_10m[0] : 'N/A';
    const rain = hourlyData.rain ? hourlyData.rain[0] : 'N/A';
    const snowfall = hourlyData.snowfall ? hourlyData.snowfall[0] : 'N/A';

    essentialDiv.innerHTML = `
        <p>Now: ${currentTemperature}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Rain: ${rain} mm</p>
        <p>Snowfall: ${snowfall} cm</p>
    `;
}

async function handleWeatherDetails() {
    const name = getQueryParam('name');

    if (name) {
        document.getElementById('placeName').innerHTML = `<i class="fa-solid fa-location-dot"></i> ` + name;
    }
    if (latitude && longitude) {
        const weatherData = await fetchWeatherData(latitude, longitude);
        if (weatherData) {
            displayDetails(weatherData);
            displayWeather(weatherData);
        }
    }
}


handleWeatherDetails();