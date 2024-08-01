
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
            <span class="wind-degree">${windSpeed} km/h</span>
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


function groupByDay(hourlyData) {
    const dailyData = {};
  
    hourlyData.time.forEach((timestamp, index) => {
      const date = timestamp.split('T')[0]; 
  
      if (!dailyData[date]) {
        dailyData[date] = {
          temperatures: [],
          windSpeeds: [],
          rain: [],
          snowfall: [],
          weatherCodes: []
        };
      }
  
      dailyData[date].temperatures.push(hourlyData.temperature_2m[index]);
      dailyData[date].windSpeeds.push(hourlyData.wind_speed_10m[index]);
      dailyData[date].rain.push(hourlyData.rain[index]);
      dailyData[date].snowfall.push(hourlyData.snowfall[index]);
      dailyData[date].weatherCodes.push(hourlyData.weathercode[index]);
    });
  
    return dailyData;
  }
  

  function calculateDailySummaries(dailyData) {
    const dailySummaries = [];
  
    for (const [date, data] of Object.entries(dailyData)) {
      const dailySummary = {
        date: date,
        minTemperature: Math.min(...data.temperatures),
        maxTemperature: Math.max(...data.temperatures),
        avgWindSpeed: (data.windSpeeds.reduce((a, b) => a + b, 0) / data.windSpeeds.length).toFixed(2),
        totalRain: data.rain.reduce((a, b) => a + b, 0).toFixed(2),
        totalSnowfall: data.snowfall.reduce((a, b) => a + b, 0).toFixed(2),
        predominantWeatherCode: mode(data.weatherCodes)
      };
  
      dailySummaries.push(dailySummary);
    }
  
    return dailySummaries;
  }
  
  function mode(arr) {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  }
  
 
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
  
    if (dateStr === today) {
        return `Today ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`;
    }

    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
}

function displayWeatherSummaries(dailySummaries) {
    const essentialDiv = document.getElementById('weatherDetails');
    const today = new Date().toISOString().split('T')[0];

    const todayIndex = dailySummaries.findIndex(summary => summary.date === today);

    const next7DaysSummaries = dailySummaries.slice(todayIndex, todayIndex + 7);

    let weatherHtml = '';
    next7DaysSummaries.forEach(summary => {
        const formattedDate = formatDate(summary.date); 
        weatherHtml += `
            <div class="weather-summary">
                <h2 class="date">${formattedDate}</h2>
                <p class="temperatures">Max ${summary.maxTemperature}°C/ Min ${summary.minTemperature}°C</p>
                <div class="numbers">
                    <p><i class="fa-solid fa-wind"></i> ${summary.avgWindSpeed} km/h</p>
                    <p><i class="fa-solid fa-umbrella"></i> ${summary.totalRain} mm</p>
                </div>
                <p>Predominant Weather: ${weatherCodeMap[summary.predominantWeatherCode] || 'Unknown'}</p>
            </div>
        `;
    });

    essentialDiv.innerHTML = weatherHtml;
}

async function handleWeatherDetails() {
    const latitude = getQueryParam('latitude');
    const longitude = getQueryParam('longitude');
    const name = getQueryParam('name');

    if (name) {
        document.getElementById('placeName').innerHTML = `<i class="fa-solid fa-location-dot"></i> ` + name;
    }

    if (latitude && longitude) {
        const weatherData = await fetchWeatherData(latitude, longitude);
        if (weatherData) {
            const hourlyData = weatherData.hourly || {};
            const dailyData = groupByDay(hourlyData);
            const dailySummaries = calculateDailySummaries(dailyData);
            displayDetails(weatherData);
            displayWeatherSummaries(dailySummaries);
        }
    }
}

handleWeatherDetails();