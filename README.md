# SkyCast 🌤️

A modern weather forecasting web application built with HTML, CSS, and JavaScript.

SkyCast provides real-time weather information for cities around the world, including current conditions, hourly forecasts, daily forecasts, air quality, sunrise/sunset times, location details, and a responsive dark/light mode interface.

---

## 🚀 Features

- 🌍 Search weather for cities around the world
- 📍 Detect user's current location using Geolocation API
- 🌡️ Display current temperature and weather conditions
- 🤗 Show feels-like temperature
- 💧 Humidity information
- 💨 Wind speed
- 🧭 Atmospheric pressure
- 👁️ Visibility information
- 🕐 Hourly weather forecast
- 📅 Multi-day weather forecast
- 🌅 Sunrise and sunset times
- 🍃 Air Quality Index (AQI)
- 🗺️ Interactive world map with location marker
- 🌙 Dark mode
- ☀️ Light mode
- 💾 Theme preference saved using Local Storage
- ⚡ Quick city search
- ⌨️ Search using the Enter key
- 🔄 Loading states while fetching weather data
- 📱 Responsive design for different screen sizes
- ℹ️ Dedicated About section

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)

### APIs

- **Open-Meteo Weather API** — current weather, hourly forecast, daily forecast, sunrise/sunset and weather data
- **Open-Meteo Air Quality API** — Air Quality Index data
- **Open-Meteo Geocoding API** — city search and coordinates
- **OpenStreetMap Nominatim API** — reverse geocoding for the user's location

### Libraries

- **D3.js** — used for the interactive world map
- **TopoJSON** — used with D3.js for geographic map data
- **Font Awesome** — icons used throughout the interface

### Browser APIs

- Geolocation API
- Local Storage API
- Fetch API
- DOM API

---

## 📌 Main Functionality

### Weather Search

Users can search for a city and SkyCast retrieves its coordinates before requesting the latest weather information.

The dashboard is then updated dynamically without reloading the page.

### Current Weather

The current weather dashboard displays:

- Location
- Date and time
- Temperature
- Weather condition
- Feels-like temperature
- Humidity
- Wind speed
- Atmospheric pressure
- Visibility
- Weather icon

### Hourly Forecast

SkyCast displays upcoming hourly weather information and also provides an expanded **Next 24 Hours** view.

### Daily Forecast

The dashboard provides a multi-day forecast with:

- Date
- Weather condition
- Weather icon
- Minimum temperature
- Maximum temperature

### Air Quality

The application retrieves AQI data and converts the value into a readable status such as:

- Good
- Moderate
- Unhealthy for Sensitive Groups
- Unhealthy
- Very Unhealthy
- Hazardous

### Location Detection

SkyCast can use the browser's Geolocation API to detect the user's current coordinates.

The coordinates are then reverse-geocoded to display the corresponding location.

### Interactive Map

The sidebar contains a world map with a marker showing the selected location.

The map is built using D3.js and geographic data.

### Dark / Light Mode

Users can switch between dark and light themes.

The selected theme is stored in Local Storage, so the preference remains after refreshing the page.

---

## 🎨 UI & Design

SkyCast uses a modern weather-dashboard design with:

- Glassmorphism-inspired cards
- Dark blue color palette
- Weather illustrations
- Responsive layouts
- Custom weather icons
- Interactive navigation
- Loading animations
- Separate Home and About sections

The interface was designed to keep important weather information visible while maintaining a clean and simple layout.

---

## 📂 Project Structure

```text
SkyCast/
│
├── index.html
├── styles.css
├── script.js
│
├── Weather-image/
│   ├── clear.png
│   ├── cloudy.png
│   ├── fog.png
│   ├── moon.png
│   ├── partly.png
│   ├── partly-cloudy-night.png
│   ├── rainy.png
│   ├── night-rain.png
│   ├── snow.png
│   └── Thunderstorm.png
│
├── map-data/
│   └── world map data
│
├── background.png
├── bg2.png
├── lightbg.png
├── earth.png
├── earth2.png
├── logo.png
├── sunrise.png
└── sunset.png

## Author

Mohit Raj Sinha

GitHub: https://github.com/Matrixmohit
