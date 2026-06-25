// NOTE: Uses OpenWeatherMap API. Replace API_KEY with a real key to test network calls.
// Mock data is provided so the UI logic can be tested without a real key.

const API_KEY = '11c0076bc631dd0ad38a3930e30b0248';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// let searchHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
let searchHistory = JSON.parse(localStorage.getItem('weather_history')) || [];

function saveHistory() {
  localStorage.setItem('weather_history', JSON.stringify(searchHistory));
}

async function searchWeather() {
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value;
  

  hideError();
  hideWeatherCard();

  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    displayWeather(data);
    addToHistory(city);
    document.getElementById('cityInput').value=""
  } catch (err) {
    showError('Failed to fetch weather data. Check your connection.');
  }
  
}

function displayWeather(data) {  
  document.getElementById('cityName').textContent = data.name + ', ' + data.sys.country;
  document.getElementById('temperature').textContent = `Temp: ${data.main.temp}°C`;
  document.getElementById('description').textContent =
    `Condition: ${data.weather[0].description}`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind: ${data.wind.speed} km/h`;
  document.getElementById('feelsLike').textContent =
    `Feels Like: ${data.main.temp_min}°C`;
  showWeatherCard();
}

function addToHistory(city) {
  if(searchHistory.includes(city)){
    return
  }
  searchHistory.push(city);
  saveHistory();
  renderHistory();
}

function clearHistory() {
  searchHistory = [];
  saveHistory();
  renderHistory();
  document.getElementById('weatherCard').classList.add('hidden');
}

function renderHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  
  searchHistory.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.onclick = () => {
      document.getElementById('cityInput').value = city;
      searchWeather();
    };
    list.appendChild(li);
  });
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideError() {
  document.getElementById('errorMsg').classList.add('hidden');
}

function showWeatherCard() {
  document.getElementById('weatherCard').classList.remove('hidden');
}

function hideWeatherCard() {
  document.getElementById('errorMsg').classList.add('hidden');
}

// Initialize
renderHistory();
