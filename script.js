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
const linkedinShare = document.getElementById('linkedinShare');
const twitterShare = document.getElementById('twitterShare');

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
        const temp = `${data.temp}°`;
        const location = `${data.city}, ${data.country}`;
        const condition = data.description;
        const humidity = `${data.humidity}%`;
        const wind = `${data.windSpeed} km/h`;
        const feelsLike = `${data.feelsLike}°C`;
        const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

        tempEl.textContent = temp;
        cityEl.textContent = location;
        descEl.textContent = condition;
        humidityEl.textContent = humidity;
        windEl.textContent = wind;
        feelsLikeEl.textContent = feelsLike;
        countryCodeEl.textContent = data.country;

        iconEl.src = iconUrl;
        iconEl.alt = condition;

        // Show UI with animation
        weatherDisplay.classList.add('active');

        // Share Content Generator
        const getShareContent = () => {
            const shareUrl = 'https://node-js-kappa-three.vercel.app/';
            return {
                text: `🌍 SkyCast Intelligence Report: ${data.city}\n\n🌡️ Temp: ${temp}\n☁️ Condition: ${condition}\n💧 Humidity: ${humidity}\n💨 Wind: ${wind}\n\nView live: ${shareUrl}`,
                url: shareUrl,
                icon: iconUrl
            };
        };

        // LinkedIn Share
        linkedinShare.onclick = () => {
            const content = getShareContent();
            navigator.clipboard.writeText(`${content.text}\n${content.icon}`).then(() => {
                alert(`Detailed Weather Report & Icon URL copied for LinkedIn!`);
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content.url)}`, '_blank');
            });
        };

        // Twitter Share
        twitterShare.onclick = () => {
            const content = getShareContent();
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.text)}&url=${encodeURIComponent(content.url)}`;
            window.open(twitterUrl, '_blank');
        };

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
