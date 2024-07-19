
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


async function fetchWeatherData(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

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



function displayDetails(data) {
    const weatherDiv = document.getElementById('essentialDetails');
    const current = data.current; 
    const screenWidth = window.innerWidth;

    
    let weatherHtml = `
        <div class="temperature">
            <span class="now">Now</span> 
            <span class="degree">${current.temperature_2m}°</span>
        </div>
        <div class="apparent">
        <span class="feels-like">Feels like</span> 
        <span class="feels-degree">${current.apparent_temperature}°</span>
        </div>
    `;

   
    if (screenWidth > 750) {
        if (current.snowfall > 0) {
            weatherHtml += `<p>Snowfall: ${current.snowfall} cm</p>`;
        } else {
            weatherHtml += `<p>Rain: ${current.rain} mm</p>`;
        }
        weatherHtml += `<p>Wind Speed: ${current.wind_speed_10m} m/s</p>`;
    }

    weatherDiv.innerHTML = weatherHtml;
}

function displayWeather(data) {
    const essentialDiv = document.getElementById('weatherDetails');
    const current = data.current; 
    essentialDiv.innerHTML = `
        <p>Now: ${current.temperature_2m}°</p>
        <p>Feels like: ${current.apparent_temperature}°</p>
        <p>Rain: ${current.rain} mm</p>
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
            displayDetails(weatherData);
            displayWeather(weatherData);
        }
    }
}


handleWeatherDetails();