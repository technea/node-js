const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const loader = document.getElementById('loader');
const errorBox = document.getElementById('errorBox');
const errorMsg = document.getElementById('errorMsg');
const currentDateEl = document.getElementById('currentDate');

// Update UI elements
const tempEl = document.getElementById('temp');
const cityEl = document.getElementById('city');
const descEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const feelsLikeEl = document.getElementById('feelsLike');
const countryCodeEl = document.getElementById('countryCode');
const iconEl = document.getElementById('weatherIcon');

// Update Date
function updateDate() {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('en-GB', options).replace(/,/g, '');
}

async function fetchWeather(city) {
    try {
        // Prepare UI for loading
        loader.style.display = 'block';
        weatherDisplay.classList.remove('active');
        errorBox.style.display = 'none';

        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        loader.style.display = 'none';

        if (data.error) {
            errorMsg.textContent = data.error;
            errorBox.style.display = 'flex';
            return;
        }

        // Populate Data
        tempEl.textContent = `${data.temp}°`;
        cityEl.textContent = `${data.city}, ${data.country}`;
        descEl.textContent = data.description;
        humidityEl.textContent = `${data.humidity}%`;
        windEl.textContent = `${data.windSpeed} km/h`;
        feelsLikeEl.textContent = `${data.feelsLike}°C`;
        countryCodeEl.textContent = data.country;

        // Use high-quality icons
        iconEl.src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
        iconEl.alt = data.description;

        // Show UI with animation
        weatherDisplay.classList.add('active');
    } catch (err) {
        loader.style.display = 'none';
        errorMsg.textContent = 'Network error. Please try again.';
        errorBox.style.display = 'flex';
        console.error(err);
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

// Initial load
window.addEventListener('load', () => {
    updateDate();
    fetchWeather('London');
});
