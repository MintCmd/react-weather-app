import React, { useState } from 'react';

// Объект с параметрами API OpenWeatherMap
const api = {
  key: "68fe7446f46972cc7920d4486e3ff094",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  // Состояния для строки поиска, текущей погоды и прогноза
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  // Поиск погоды и прогноза по нажатию Enter
  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&lang=ru&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          // Запрос погоды
          if (result) {
            fetch(`${api.base}forecast?q=${query}&units=metric&lang=ru&APPID=${api.key}`)
              .then(res => res.json())
              .then(forecastResult => {
                setForecast(forecastResult.list || []);
              });
          } else {
            setForecast([]);
          }
        });
    }
  };

  // Форматирование даты для отображения
  const dateBuilder = (d) => {
    let months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    let days = [
      "Воскресенье", "Понедельник", "Вторник", "Среда",
      "Четверг", "Пятница", "Суббота"
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];

    return `${day}, ${date} ${month}`;
  };

  // Форматирование времени для прогноза
  const formatTime = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  // Получение ближайшего прогноза на 24 часа вперёд
  const getFutureForecast = () => {
    const now = Date.now();
    const future = forecast.filter(item => new Date(item.dt * 1000).getTime() > now);
    return future.slice(0, 8);
  };

  return (
    // Изменение фона в зависимости от температуры
    <div className={
      (typeof weather.main !== "undefined")
        ? (weather.main.temp > 21 ? 'app warm' : 'app')
        : 'app'
    }>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Поиск"
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
          />
        </div>
        {(typeof weather.main !== "undefined") ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}</div>
              <div className="date">
                {dateBuilder(
                  weather.dt
                    ? new Date((weather.dt + weather.timezone) * 1000)
                    : new Date()
                )}
              </div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}℃
              </div>
              <div className="weather">
                <img
                  className="weather-icon"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  style={{ verticalAlign: 'middle', marginRight: '8px' }}
                />
                {weather.weather[0].description.charAt(0).toUpperCase() +
                  weather.weather[0].description.slice(1)}
              </div>
              <div className="weather-details-grid">
                <div className="weather-detail">
                  <div className="detail-label">Ощущается как</div>
                  <div className="detail-value">{Math.round(weather.main.feels_like)}℃</div>
                </div>
                <div className="weather-detail">
                  <div className="detail-label">Влажность</div>
                  <div className="detail-value">{weather.main.humidity}%</div>
                </div>
                <div className="weather-detail">
                  <div className="detail-label">Давление</div>
                  <div className="detail-value">{Math.round(weather.main.pressure * 100 / 133.3)} мм рт. ст.</div>
                </div>
                <div className="weather-detail">
                  <div className="detail-label">Ветер</div>
                  <div className="detail-value">{weather.wind.speed} м/с</div>
                </div>
              </div>
              {/* Прогноз погоды на ближайшие часы */}
              {forecast.length > 0 && (
                <div className="forecast-scroll">
                  {getFutureForecast().map((item, idx) => (
                    <div className="forecast-cell" key={idx}>
                      <div className="forecast-temp">{Math.round(item.main.temp)}℃</div>
                      <img
                        className="forecast-icon"
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                      />
                      <div className="forecast-time">{formatTime(item.dt_txt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
