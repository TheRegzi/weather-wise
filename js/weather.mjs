
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
    0: { description: 'Clear sky', image: '/assets/brightness_9253338.png' },
    1: { description: 'Mainly clear', image: '/assets/cloud-sun_7407060.png' },
    2: { description: 'Partly cloudy', image: '/assets/clouds-sun_7407066.png' },
    3: { description: 'Overcast', image: '/assets/smoke_7407108.png' },
    45: { description: 'Fog', image: '/assets/smog_7434820.png.png' },
    48: { description: 'Depositing rime fog', image: '/assets/rime-fog.png' },
    51: { description: 'Drizzle: Light', image: '/assets/light-drizzle.png' },
    53: { description: 'Drizzle: Moderate', image: '/assets/Moderate-drizzle.svg' },
    55: { description: 'Drizzle: Dense', image: '/assets/dense_drizzle.png' },
    56: { description: 'Freezing Drizzle: Light', image: '/assets/freezing-drizzle.webp' },
    57: { description: 'Freezing Drizzle: Dense', image: '/assets/freezing-drizzle.webp' },
    61: { description: 'Rain: Slight', image: '/assets/slight-rain.png' },
    63: { description: 'Rain: Moderate', image: '/assets/moderate-rain.png' },
    65: { description: 'Rain: Heavy', image: '/assets/rain_heavy.webp' },
    66: { description: 'Freezing Rain: Light', image: '/assets/freezing-drizzle.webp' },
    67: { description: 'Freezing Rain: Heavy', image: '/assets/freezing-drizzle.webp' },
    71: { description: 'Snowfall: Slight', image: '/assets/lightsnow.webp' },
    73: { description: 'Snowfall: Moderate', image: '/assets/moderate-snow.png' },
    75: { description: 'Snowfall: Heavy', image: '/assets/heavy-snow.jpg' },
    77: { description: 'Snow grains', image: '/assets/snowgrains.jpg' },
    80: { description: 'Rain showers: Slight', image: '/assets/showers-slight.png' },
    81: { description: 'Rain showers: Moderate', image: '/assets/showers-moderate.png' },
    82: { description: 'Rain showers: Violent', image: '/assets/cloud-showers_7407048.png' },
    85: { description: 'Snow showers: Slight', image: '/assets/light-snow-shower.png' },
    86: { description: 'Snow showers: Heavy', image: '/assets/heavy-snow-shower.png' },
    95: { description: 'Thunderstorm: Slight or moderate', image: '/assets/thunder-light.png' },
    96: { description: 'Thunderstorm with slight hail', image: '/assets/thunger-slight-hail.webp' },
    99: { description: 'Thunderstorm with heavy hail', image: '/assets/thunder-heavy.webp' }
};



function displayDetails(data) {
    const weatherDiv = document.getElementById('essentialDetails');
    const hourlyData = data.hourly || {};

    const currentTime = new Date().toISOString();
    const timeIndex = hourlyData.time.findIndex(time => time === currentTime.slice(0, 13) + ':00');
    const currentTemperature = (timeIndex !== -1 && hourlyData.temperature_2m) ? hourlyData.temperature_2m[timeIndex] : 'N/A'; 
    const windSpeed = (timeIndex !== -1 && hourlyData.wind_speed_10m) ? hourlyData.wind_speed_10m[timeIndex] : 'N/A'; 
    const rain = (timeIndex !== -1 && hourlyData.rain) ? hourlyData.rain[timeIndex] : 'N/A'; 
    const snowfall = (timeIndex !== -1 && hourlyData.snowfall) ? hourlyData.snowfall[timeIndex] : 'N/A';

    
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
        const weatherData = weatherCodeMap[summary.predominantWeatherCode] || { description: 'Unknown', image: 'default.png' };
        const weatherDescription = weatherData.description;
        const weatherImage = weatherData.image;

        weatherHtml += `
            <div class="weather-summary">
                <h2 class="date">${formattedDate}</h2>
                <img src="${weatherImage}" alt="${weatherDescription}" />
                <p class="temperatures">${summary.maxTemperature}° / ${summary.minTemperature}°</p>
                <div class="numbers">
                    <p class="wind-rain"><i class="fa-solid fa-wind"></i> ${summary.avgWindSpeed} km/h</p>
                    <p class="wind-rain"><i class="fa-solid fa-umbrella"></i> ${summary.totalRain} mm</p>
                </div>
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