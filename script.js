const thisWeekWeather = "http://api.weatherapi.com/v1/forecast.json";

const locationWeather = "San Jose, CR";
const searchBar = document.getElementById("search-location");
searchBar.value = locationWeather;

const currentWeather = document.getElementById("current-weather");
const currentFore = document.getElementById("current");
const weekWeather = document.getElementById("this-week-weather");

async function getForecastWeather(location, days = 3) {
  try {
    const url = `${thisWeekWeather}?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return null;
  }
}

function renderAllWeatherData(forecastData) {
  const current = forecastData.current;
  const astronomy = forecastData.forecast.forecastday[0].astro;
  const todayForecast = forecastData.forecast.forecastday[0].day;

  console.log("Astronomy data:", astronomy);

  console.log(forecastData.forecast.forecastday[0]);

  currentFore.innerHTML = `
            <div>
                <div>
               <img src=http:${current.condition.icon} alt=${current.condition.text} />
                </div>
                <div>
                 <p><span class="celsius">${current.temp_c}°</span><span class="fahr">${current.temp_f}°</span></p>
                 <p class="text-secondary">${current.condition.text}</p>
                </div>   
            </div>
            <div>
                <div>
                    <div>
                        <p><i class="bi bi-arrow-down"></i> Min</p>
                        <p><span class="celsius">${todayForecast.mintemp_c}°</span><span class="fahr">${todayForecast.mintemp_f}°</span></p>
                    </div>
                    <div>
                        <p><i class="bi bi-arrow-up"></i> Max</p>
                        <p><span class="celsius">${todayForecast.maxtemp_c}°</span><span class="fahr">${todayForecast.maxtemp_f}°</span></p>
                    </div>
                </div>
                <p>Feels like <span class="celsius">${current.feelslike_c}°</span><span class="fahr">${current.feelslike_f}°</span></p>
            </div>`;

  currentWeather.innerHTML = `
    <div>
        <p class="text-secondary">Chance of rain</p>
        <p>${todayForecast.daily_chance_of_rain || "N/A"}%</p>
    </div>
    <div>
        <p class="text-secondary">Wind</p>
        <p><span class="kmh">${current.wind_kph} km/h</span><span class="mph">${
    current.wind_mph
  } mph</span></p>
    </div>
    <div>
        <p class="text-secondary">Sunrise</p>
        <p>${astronomy.sunrise}</p>
    </div>
    <div>
        <p class="text-secondary">Sunset</p>
        <p>${astronomy.sunset}</p>
    </div>
    <div>
        <p class="text-secondary">UV index</p>
        <p>${current.uv}</p>
    </div>
    <div>
        <p class="text-secondary">Pressure</p>
        <p>${current.pressure_mb} mb</p>
    </div>
    <div>
        <p class="text-secondary">Humidity</p>
        <p>${current.humidity}%</p>
    </div>
    <div>
        <p class="text-secondary">Gusts</p>
        <p><span class="kmh">${current.gust_kph} km/h</span><span class="mph">${
    current.gust_mph
  } mph</span></p>
    </div>`;

  if (forecastData && weekWeather) {
    const temps = forecastData.forecast.forecastday.map((day, index) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
      dayName: new Date(day.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      maxC: day.day.maxtemp_c,
      maxF: day.day.maxtemp_f,
      minC: day.day.mintemp_c,
      minF: day.day.mintemp_f,
    }));

    let html = "";
    temps.forEach((day) => {
      html += `
        <div class="temp-card">
          <h3>${day.dayName}</h3>
          <p class="date">${day.date}</p>
          
          <div class="temp-display">
            <div class="temp-high">
              <span class="label">Max</span>
              <span class="celsius">${day.maxC}°</span>
              <span class="fahr">${day.maxF}°</span>
            </div>
            
            <div class="temp-low">
              <span class="label">Min</span>
              <span class="celsius">${day.minC}°</span>
              <span class="fahr">${day.minF}°</span>
            </div>
          </div>
        </div>
      `;
    });

    weekWeather.innerHTML = html;
  }
}

async function initWeatherApp() {
  try {
    const forecastData = await getForecastWeather(locationWeather, 3);

    if (forecastData) {
      console.log("Forecast data (includes current):", forecastData);
      renderAllWeatherData(forecastData);
    }
  } catch (error) {
    console.error("Error initializing weather app:", error);
  }
}

initWeatherApp();
