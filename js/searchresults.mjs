function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch search results using OpenCage Geocoding API
async function fetchSearchResults(query) {
    const apiKey = '24b6eadf4f294689822c749ae70ba115'; // Replace with your OpenCage API key
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=5`;

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
        return data.results.map(result => ({
            name: result.formatted,
            latitude: result.geometry.lat,
            longitude: result.geometry.lng
        }));
    } catch (error) {
        console.error('Failed to fetch search results:', error);
        return [];
    }
}


function displaySearchResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; 
    results.forEach(result => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="/html/single-place-weather.html?latitude=${result.latitude}&longitude=${result.longitude}">${result.name}</a>`;
        resultsDiv.appendChild(listItem);
    });
}


async function handleSearchResults() {
    const query = getQueryParam('location');
    if (query) {
        const searchResults = await fetchSearchResults(query);
        displaySearchResults(searchResults);
    }
}


handleSearchResults();