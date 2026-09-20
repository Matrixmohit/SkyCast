const searchInput = document.querySelector("#cities-input");
const searchButton = document.querySelector("#search-btn");
const hourlySeeMore = document.querySelector("#hourly-see-more");
const navHome = document.querySelector("#nav-home");
const navAbout = document.querySelector("#nav-about");

const homePage = document.querySelector(".container");
const aboutPage = document.querySelector("#about-page");

navHome.addEventListener("click", function (event) {
  event.preventDefault();

  homePage.style.display = "";
  aboutPage.style.display = "none";

  navHome.classList.add("active");
  navAbout.classList.remove("active");
});

navAbout.addEventListener("click", function (event) {
  event.preventDefault();

  homePage.style.display = "none";
  aboutPage.style.display = "block";

  navAbout.classList.add("active");
  navHome.classList.remove("active");
});

let hourlyForecastData = null;
let dailyForecastData = null;
let currentHourIndex = 0;

const cityName = document.querySelector(".current-place-weather h2");
const mapCity = document.querySelector("#map-city");
const coordinates = document.querySelector("#coordinates");
const temperature = document.querySelector(".temperature h1");
const weatherIcon = document.querySelector("#weather-icon");
const weatherCondition = document.querySelector(
  ".temperature p:nth-of-type(1)",
);
const theme = document.querySelector(".theme-toggle");
const earthImage = document.querySelector("#earth-image");
const weatherStats = document.querySelectorAll(".weather-stat");
const feelsLike = document.querySelector(".temperature span");
const currentDate = document.querySelector("#current-date");
const hourlyCards = document.querySelectorAll(".hourly-card");
const upcomingCards = document.querySelectorAll(".upcoming-card");
const quickCities = document.querySelectorAll(".city");
const mapMarker = document.querySelector("#map-marker");
const airValue = document.querySelector(".air-value h2");
const airStatus = document.querySelector(".air-value span");
const airDescription = document.querySelector(".air-description");
const sunriseTime = document.querySelector(
  ".sunrise .sun-time p:nth-of-type(2)",
);
const sunsetTime = document.querySelector(".sunset .sun-time p:nth-of-type(2)");

const loadingScreen = document.querySelector("#loading-screen");

function showLoading() {
  loadingScreen.style.display = "flex";
}

function hideLoading() {
  loadingScreen.style.display = "none";
}

function showSearchLoading() {
  document.querySelector(".weather-dashboard").classList.add("search-loading");

  showLoading();
}

function hideSearchLoading() {
  document
    .querySelector(".weather-dashboard")
    .classList.remove("search-loading");

  hideLoading();
}

// Search Button
searchButton.addEventListener("click", async function () {
  const city = searchInput.value.trim();

  if (city === "") {
    return alert("Give us a place, and we'll bring you its forecast. 🌤️");
  }

  searchButton.textContent = "Searching...";
  showSearchLoading();

  try {
    await getLocation(city);
  } finally {
    searchButton.textContent = "Search";
    hideSearchLoading();
  }
});

// Hourly See More
hourlySeeMore.addEventListener("click", function (event) {
  event.preventDefault();

  if (!hourlyForecastData) return;

  const hourlyDetails = document.querySelector("#hourly-details");
  const hourlyCardsContainer = document.querySelector("#hourly-details-cards");
  const hourlyCardsSection = document.querySelector(".hourly-cards");

  hourlyCardsSection.style.display = "none";
  hourlyDetails.style.display = "block";

  hourlyCardsContainer.innerHTML = "";

  for (let i = currentHourIndex; i < currentHourIndex + 24; i++) {
    const time = hourlyForecastData.time[i];
    const temp = hourlyForecastData.temperature_2m[i];
    const code = hourlyForecastData.weather_code[i];

    const card = document.createElement("div");
    card.classList.add("hourly-detail-card");

    const timeText = document.createElement("p");
    const image = document.createElement("img");
    const tempText = document.createElement("p");

    const hour = new Date(`${time}:00Z`).toLocaleString("en-IN", {
      timeZone: "UTC",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    timeText.textContent = hour;
    const hourValue = new Date(`${time}:00Z`).getUTCHours();
    const isNight = hourValue >= 18 || hourValue < 6;
    image.src = getWeatherIcon(code, isNight);
    image.alt = "weather icon";
    tempText.textContent = `${temp}°C`;

    card.appendChild(timeText);
    card.appendChild(image);
    card.appendChild(tempText);

    hourlyCardsContainer.appendChild(card);
  }
});

const hourlyBack = document.querySelector("#hourly-back");

hourlyBack.addEventListener("click", function () {
  document.querySelector("#hourly-details").style.display = "none";
  document.querySelector(".hourly-cards").style.display = "grid";
});

// 5-Day See More
const daysSeeMore = document.querySelector("#days-see-more");

daysSeeMore.addEventListener("click", function (event) {
  event.preventDefault();

  if (!dailyForecastData) return;

  const daysDetails = document.querySelector("#days-details");
  const upcomingCardsSection = document.querySelector(".upcoming-cards");
  const daysDetailsCards = document.querySelector("#days-details-cards");

  upcomingCardsSection.style.display = "none";
  daysDetails.style.display = "block";

  daysDetailsCards.innerHTML = "";

  for (let i = 0; i < dailyForecastData.time.length; i++) {
    const date = dailyForecastData.time[i];
    const maxTemp = dailyForecastData.temperature_2m_max[i];
    const minTemp = dailyForecastData.temperature_2m_min[i];
    const code = dailyForecastData.weather_code[i];

    const card = document.createElement("div");
    card.classList.add("day-detail-card");

    const dateText = document.createElement("p");
    const image = document.createElement("img");
    const tempText = document.createElement("p");

    const formattedDate = new Date(`${date}T00:00:00Z`).toLocaleDateString(
      "en-IN",
      {
        timeZone: "UTC",
        weekday: "short",
        day: "numeric",
        month: "short",
      },
    );

    dateText.textContent = formattedDate;
    image.src = getWeatherIcon(code, false);
    image.alt = "weather icon";
    tempText.textContent = `${minTemp}°C / ${maxTemp}°C`;

    card.appendChild(dateText);
    card.appendChild(image);
    card.appendChild(tempText);

    daysDetailsCards.appendChild(card);
  }
});

const daysBack = document.querySelector("#days-back");

daysBack.addEventListener("click", function () {
  document.querySelector("#days-details").style.display = "none";
  document.querySelector(".upcoming-cards").style.display = "grid";
});

//Search by pressing Enter

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

// Quick Cities

quickCities.forEach(function (cityButton) {
  cityButton.addEventListener("click", async function () {
    const city = cityButton.textContent;

    searchInput.value = city;

    searchButton.textContent = "Searching...";
    showSearchLoading();

    try {
      await getLocation(city);
    } finally {
      searchButton.textContent = "Search";
      hideSearchLoading();
    }
  });
});

// Theme Toggle

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  earthImage.src = "earth2.png";

  const icon = theme.querySelector("i");
  icon.classList.remove("fa-moon");
  icon.classList.add("fa-sun");
}

theme.addEventListener("click", function () {
  // Rotate the toggle 360 degrees
  theme.classList.remove("rotate-toggle");

  // Restart animation every click
  void theme.offsetWidth;

  theme.classList.add("rotate-toggle");

  const icon = theme.querySelector("i");

  // Switch theme
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    // Light mode
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");

    earthImage.src = "earth2.png";

    localStorage.setItem("theme", "light");
  } else {
    // Dark mode
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");

    earthImage.src = "earth.png";
    localStorage.setItem("theme", "dark");
  }
});

//Get location
// Get user's current location
function getUserLocation() {
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Show location on map
      currentLatitude = latitude;
      currentLongitude = longitude;

      updateMapMarker(latitude, longitude);

      // Reverse geocode user's location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`,
      );

      const locationData = await response.json();

      const city =
        locationData.address.city ||
        locationData.address.town ||
        locationData.address.village ||
        locationData.address.suburb ||
        "Your Location";

      const country = locationData.address.country;

      cityName.textContent = `${city}, ${country}`;
      mapCity.textContent = `${city}, ${country}`;

      coordinates.textContent = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? "N" : "S"}, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? "E" : "W"}`;

      // Get weather for user's location
      await getWeatherData(latitude, longitude);

      document.querySelector(".weather-dashboard").style.visibility = "visible";
      document.querySelector(".sidebar").style.visibility = "visible";

      hideLoading();
    },

    function (error) {
      hideLoading();

      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Location access is blocked. Please allow location access for SkyCast.",
        );
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        alert(
          "Your device location is turned off. Please turn on Location Services and try again.",
        );
      } else if (error.code === error.TIMEOUT) {
        alert("We couldn't get your location in time. Please try again.");
      }
    },
  );
}

async function getLocation(city) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    );

    const locData = await response.json();

    if (!locData.results || locData.results.length === 0) {
      alert("City not found");
      return;
    }

    const location = locData.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;

    currentLatitude = latitude;
    currentLongitude = longitude;

    updateMapMarker(latitude, longitude);

    const placeName =
      location.name === location.country
        ? location.country
        : `${location.name}, ${location.country}`;

    cityName.textContent = placeName;
    mapCity.textContent = placeName;

    coordinates.textContent = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? "N" : "S"}, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? "E" : "W"}`;

    await getWeatherData(latitude, longitude);
  } catch (error) {
    console.error("Location error:", error);
    alert("Unable to find this city");
  }
}

//get weather data
async function getWeatherData(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,surface_pressure,visibility,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=auto`,
    );

    const data = await response.json();

    const airResponse = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`,
    );

    const airData = await airResponse.json();
    const aqi = airData.current.us_aqi;
    airValue.textContent = aqi;
    airStatus.textContent = getAirQualityStatus(aqi);
    airDescription.textContent = getAirQualityDescription(aqi);

    const current = data.current;
    const hourly = data.hourly;
    const daily = data.daily;
    dailyForecastData = daily;
    hourlyForecastData = hourly;

    const sunrise = daily.sunrise[0];
    const sunset = daily.sunset[0];

    const sunriseFormatted = new Date(`${sunrise}:00Z`).toLocaleTimeString(
      "en-IN",
      {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      },
    );

    const sunsetFormatted = new Date(`${sunset}:00Z`).toLocaleTimeString(
      "en-IN",
      {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      },
    );

    sunriseTime.textContent = sunriseFormatted;
    sunsetTime.textContent = sunsetFormatted;

    currentHourIndex = hourly.time.findIndex(
      (time) => time.slice(0, 13) === current.time.slice(0, 13),
    );

    for (let i = 0; i < hourlyCards.length; i++) {
      const index = currentHourIndex + i;

      const time = hourly.time[index];
      const temp = hourly.temperature_2m[index];
      const code = hourly.weather_code[index];

      const timeElement = hourlyCards[i].querySelector("p");
      const imageElement = hourlyCards[i].querySelector("img");
      const temperatureElement = hourlyCards[i].querySelectorAll("p")[1];

      const hourDate = time.slice(0, 10);
      const dayIndex = daily.time.findIndex((date) => date === hourDate);

      const isNight =
        time < daily.sunrise[dayIndex] || time >= daily.sunset[dayIndex];

      const hour = new Date(`${time}:00Z`).toLocaleString("en-IN", {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      timeElement.textContent = hour;
      imageElement.src = getWeatherIcon(code, isNight);
      temperatureElement.textContent = `${temp}°C`;
    }

    for (let i = 0; i < upcomingCards.length; i++) {
      const date = daily.time[i];
      const maxTemp = daily.temperature_2m_max[i];
      const minTemp = daily.temperature_2m_min[i];
      const code = daily.weather_code[i];

      const dateElement = upcomingCards[i].querySelector("p");
      const imageElement = upcomingCards[i].querySelector("img");
      const temperatureElement = upcomingCards[i].querySelectorAll("p")[1];

      const formattedDate = new Date(`${date}T00:00:00Z`).toLocaleDateString(
        "en-IN",
        {
          timeZone: "UTC",
          weekday: "short",
          day: "numeric",
          month: "short",
        },
      );

      dateElement.textContent = formattedDate;
      imageElement.src = getWeatherIcon(code, false);
      temperatureElement.textContent = `${minTemp}°C/${maxTemp}°C`;
    }

    const date = new Date(`${current.time}:00Z`);

    const formattedDate = date.toLocaleString("en-IN", {
      timeZone: "UTC",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    currentDate.textContent = formattedDate;

    // Temperature
    temperature.textContent = `${current.temperature_2m}°C`;

    // Weather condition
    weatherCondition.textContent = getWeatherCondition(current.weather_code);

    //Weather icon
    const isNight = current.time < sunrise || current.time >= sunset;

    weatherIcon.src = getWeatherIcon(current.weather_code, isNight);

    // Feels like
    feelsLike.textContent = `${current.apparent_temperature}°C`;

    // Wind
    const windSpeed = weatherStats[1].querySelector("span");
    windSpeed.textContent = `${current.wind_speed_10m} km/h`;

    // Humidity
    const humidity = weatherStats[0].querySelector("span");
    humidity.textContent = `${current.relative_humidity_2m}%`;

    // Pressure
    const pressure = weatherStats[2].querySelector("span");
    pressure.textContent = `${current.surface_pressure} hPa`;

    // Visibility
    const visibility = weatherStats[3].querySelector("span");
    visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
  } catch (error) {
    alert("Unable to fetch weather data");
  }
}

//Weather condition
function getWeatherCondition(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherCodes[code] || "Unknown";
}

function getWeatherIcon(code, isNight) {
  if (code === 0) {
    return isNight ? "Weather-image/moon.png" : "Weather-image/clear.png";
  }

  if (code === 1 || code === 2) {
    return isNight
      ? "Weather-image/partly-cloudy-night.png"
      : "Weather-image/partly.png";
  }

  if (code === 3) {
    return "Weather-image/cloudy.png";
  }

  if (code === 45 || code === 48) {
    return "Weather-image/fog.png";
  }

  if ([51, 53, 55].includes(code)) {
    return isNight ? "Weather-image/night-rain.png" : "Weather-image/rainy.png";
  }
  if ([61, 63, 65, 80, 81, 82].includes(code)) {
    return "Weather-image/rainy.png";
  }

  if ([71, 73, 75].includes(code)) {
    return "Weather-image/snow.png";
  }

  if ([95, 96, 99].includes(code)) {
    return "Weather-image/Thunderstorm.png";
  }

  return "Weather-image/partly.png";
}

function getAirQualityStatus(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function getAirQualityDescription(aqi) {
  if (aqi <= 50) return "Air quality is good.";
  if (aqi <= 100) return "Air quality is acceptable.";
  if (aqi <= 150) return "Sensitive groups may be affected.";
  if (aqi <= 200) return "Everyone may begin to experience health effects.";
  if (aqi <= 300) return "Health alert: everyone may be affected.";
  return "Health warning: everyone may experience serious effects.";
}

let mapProjection = null;
let currentLatitude = null;
let currentLongitude = null;
let mapLand = null;
let mapSvg = null;

function updateMapMarker(latitude, longitude) {
  if (!mapProjection || latitude === null || longitude === null) return;

  const [x, y] = mapProjection([longitude, latitude]);

  mapMarker.style.left = `${x}px`;
  mapMarker.style.top = `${y}px`;
}

function resizeMap() {
  if (!mapLand || !mapSvg) return;

  const mapWidth = mapContainer.clientWidth;
  const mapHeight = mapContainer.clientHeight;

  mapSvg.attr("width", mapWidth).attr("height", mapHeight);

  mapProjection = d3.geoNaturalEarth1().fitSize([mapWidth, mapHeight], mapLand);

  const path = d3.geoPath().projection(mapProjection);

  mapSvg.select("path").attr("d", path);

  updateMapMarker(currentLatitude, currentLongitude);
}

// Draw world map
const mapContainer = document.querySelector("#world-map");

mapSvg = d3.select("#world-map").append("svg");

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(
  function (world) {
    mapLand = topojson.feature(world, world.objects.land);

    mapSvg.append("path").datum(mapLand).attr("fill", "#3b82f6");

    resizeMap();
  },
);

const resizeObserver = new ResizeObserver(function () {
  resizeMap();
});

resizeObserver.observe(mapContainer);

// Get user's location when SkyCast opens
showLoading();
getUserLocation();
