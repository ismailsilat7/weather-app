import "./style.css";
import "weather-icons/css/weather-icons.css";
import welcomeGIF from "./images/welcome.gif"
import badRequest from "./images/badRequest.gif"
import loading from "./images/fetchData.gif"


const weatherIconMap = {
  "clear-day": "wi-day-sunny",
  "clear-night": "wi-night-clear",
  "partly-cloudy-day": "wi-day-cloudy",
  "partly-cloudy-night": "wi-night-alt-cloudy",
  cloudy: "wi-cloudy",
  fog: "wi-fog",
  wind: "wi-strong-wind",
  rain: "wi-rain",
  snow: "wi-snow",
  "snow-showers-day": "wi-day-snow",
  "snow-showers-night": "wi-night-alt-snow",
  "thunder-rain": "wi-thunderstorm",
  "thunder-showers-day": "wi-day-thunderstorm",
  "thunder-showers-night": "wi-night-alt-thunderstorm",
  "showers-day": "wi-day-showers",
  "showers-night": "wi-night-alt-showers",
  temperature: "wi-thermometer",
  feelslike: "wi-thermometer",
  humidity: "wi-humidity",
  windspeed: "wi-strong-wind",
  winddirection: "wi-wind-direction",
  compass: "wi-compass",
  barometer: "wi-barometer",
  raindrop: "wi-raindrop",
  degrees: "wi-degrees",
  "sun-rise": "wi-sunrise",
  "sun-set": "wi-sunset",
  pressure: "wi-barometer",
  "moon-rise": "wi-moonrise",
  "moon-set": "wi-moonset",
  "new-moon": "wi-moon-new",
  "waxing-crescent": "wi-moon-waxing-crescent-3",
  "first-quarter": "wi-moon-first-quarter",
  "waxing-gibbous": "wi-moon-waxing-gibbous-3",
  "full-moon": "wi-moon-full",
  "waning-gibbous": "wi-moon-waning-gibbous-3",
  "last-quarter": "wi-moon-third-quarter",
  "waning-crescent": "wi-moon-waning-crescent-3",
};

const weatherImageMap = {
  "clear-day":
    "clear blue sky, radiant midday sun, no clouds, vivid light, high resolution, nature background",
  "clear-night":
    "star-filled night sky, bright full moon, deep navy blue tones, crystal clear atmosphere, high resolution",
  "partly-cloudy-day":
    "blue sky with scattered cumulus clouds, bright sunlight, soft shadows, peaceful atmosphere",
  "partly-cloudy-night":
    "night sky with scattered clouds, moonlight streaming through, soft contrast, tranquil mood",
  cloudy:
    "dense overcast sky, thick gray clouds, muted daylight, moody atmosphere, no ground visible",
  fog: "soft hazy sky, low visibility, pale muted tones, atmospheric mist, dreamy aesthetic",
  wind: "sky with fast-moving streaked clouds, dynamic motion, dramatic lighting, high contrast",
  rain: "dark stormy rain-filled sky, heavy gray clouds, visible rain streaks, moody dramatic feel",
  snow: "overcast winter sky, pale diffused light, falling snowflakes, cold serene mood",
  "snow-showers-day":
    "bright daylight with gentle falling snow, soft diffused light, white overcast sky",
  "snow-showers-night":
    "dark snowy night sky, faint moonlight glow, falling snowflakes, serene atmosphere",
  "thunder-rain":
    "dramatic storm clouds, heavy rain, lightning bolt cutting through, intense atmosphere",
  "thunder-showers-day":
    "daylight with dark storm clouds, lightning flashes, rain falling, high drama sky",
  "thunder-showers-night":
    "night sky illuminated by lightning, rain streaks visible, stormy mood",
  "showers-day":
    "overcast daytime sky, light drizzle, soft gray clouds, gentle lighting",
  "showers-night":
    "dark rainy night sky, faint glow through clouds, raindrops visible, moody ambiance",
};

function getWeatherIconClass(icon) {
  return weatherIconMap[icon] || "wi-na";
}

function handleError(error) {
  document.getElementById("app").innerHTML = `
  <div class="welcome-message">
    <img src="${badRequest}" alt="Bad Request" class="welcome-gif" />
    <h2>Bad Request</h2>
    <p>${error}</p>
  </div>
`;
}

function getMoonPhaseName(value) {
  if (value === 0) return "New Moon";
  if (value > 0 && value < 0.25) return "Waxing Crescent";
  if (value === 0.25) return "First Quarter";
  if (value > 0.25 && value < 0.5) return "Waxing Gibbous";
  if (value === 0.5) return "Full Moon";
  if (value > 0.5 && value < 0.75) return "Waning Gibbous";
  if (value === 0.75) return "Last Quarter";
  return "Waning Crescent";
}

function getMoonPhaseIcon(value) {
  if (value === 0) return "new-moon";
  if (value > 0 && value < 0.25) return "waxing-crescent";
  if (value === 0.25) return "first-quarter";
  if (value > 0.25 && value < 0.5) return "waxing-gibbous";
  if (value === 0.5) return "full-moon";
  if (value > 0.5 && value < 0.75) return "waning-gibbous";
  if (value === 0.75) return "last-quarter";
  return "waning-crescent";
}

async function getCoordinates(location) {
  const encoded = encodeURIComponent(location);
  const response = await fetch(
    `https://us1.locationiq.com/v1/search?key=pk.1aee8fe13e28431033e4948d01188973&q=${encoded}&format=json&limit=1&namedetails=1&addressdetails=1`,
  );
  if (response.status === 404) {
    throw new Error("Location not found");
  }
  if (!response.ok) {
    throw new Error(`LocationIQ API error: ${response.status}`);
  }
  const data = await response.json();
  if (!data[0]) throw new Error("Location not found");
  console.log(data);
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    displayName: data[0].namedetails["name:en"]
      ? data[0].namedetails["name:en"]
      : data[0].namedetails.name,
    countryCode: data[0].address.country_code,
  };
}
async function getWeatherData(lat, lon, unitGroup, displayName, countryCode) {
  const symbol = unitGroup === "metric" ? "°C" : "°F";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=${unitGroup}&key=DYX5SXBMB8A3SLYYY5JERKAEQ&lang=en`;

  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const weatherData = await response.json();
  displayData(weatherData, displayName, countryCode, symbol);
}

function formatTime(timeStr) {
  if (!timeStr) return "N/A";
  const date = new Date(`1970-01-01T${timeStr}`);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function setLocationBackground(query) {
  const location = document.querySelector(".currentForecast");
  if (!location) {
    return;
  }
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization:
            "uVNxYknTivDn6N0HEyWvkcQJFdMv0kOMqblp06pxKkAwt8qZTfm6kKA8",
        },
      },
    );

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.landscape;
      location.style.backgroundImage = `url(${imageUrl})`;
      location.style.backgroundSize = "cover";
      location.style.backgroundPosition = "center";
      location.style.backgroundRepeat = "no-repeat";
      location.style.color = "#fff";
      location.style.padding = "1rem";
      location.style.borderRadius = "10px";
      location.style.boxShadow = "0 4px 15px rgba(0,0,0,0.4)";
    }
  } catch (error) {
    console.error("Error fetching Pexels background:", error);
  }
}



const form = document.getElementById("weather-form");
let lastSearch = null;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("app").innerHTML = `
  <div class="welcome-message">
    <img src="${loading}" alt="Loading" class="welcome-gif" />
    <h2>Fetching data...</h2>
  </div>
`;
  const locationInput = document.getElementById("location").value;
  const selectedUnit = document.getElementById("unitSwitch").checked
    ? "us"
    : "metric";

  try {
    const { lat, lon, displayName, countryCode } =
      await getCoordinates(locationInput);
    console.log("Found:", displayName);

    lastSearch = {
      lat,
      lon,
      displayName,
      countryCode,
    };

    await getWeatherData(lat, lon, selectedUnit, displayName, countryCode);
  } catch (err) {
    handleError(err);
  }
});

const unitSwitch = document.getElementById("unitSwitch");

unitSwitch.addEventListener("change", async () => {
  if (!lastSearch) return;

  const selectedUnit = unitSwitch.checked ? "us" : "metric";

  document.getElementById("app").innerHTML = `
  <div class="welcome-message">
    <img src="${loading}" alt="Loading" class="welcome-gif" />
    <h2>Updating units...</h2>
  </div>
`;
  try {
    await getWeatherData(
      lastSearch.lat,
      lastSearch.lon,
      selectedUnit,
      lastSearch.displayName,
      lastSearch.countryCode,
    );
  } catch (err) {
    handleError(err);
  }
});

document.getElementById("app").innerHTML = `
  <div class="welcome-message">
    <img src="${welcomeGIF}" alt="Welcome" class="welcome-gif" />
    <h2>Weather at Your Fingertips</h2>
    <p>Enter a location above to see real-time weather updates.</p>
  </div>
`;

