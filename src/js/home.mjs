
// async function fetchAPI() {
//     const apiUrl = `https://api.open-meteo.com/v1/metno?latitude=59.9127&longitude=10.7461&current=temperature_2m,apparent_temperature,is_day,rain,showers,snowfall,wind_speed_10m&hourly=temperature_2m,apparent_temperature,rain,snowfall&timezone=auto`;

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
       
//         return data;
//     } catch (error) {
//         console.error('Failed to fetch weather:', error);
//     } 
// }

// document.getElementById('searchForm').addEventListener('submit', function(event) {
//     event.preventDefault(); 
//     const searchQuery = document.getElementById('search').value;
//     if (searchQuery) {
//         window.location.href = `/html/searchresults.html?location=${encodeURIComponent(searchQuery)}`;
//     }
// });