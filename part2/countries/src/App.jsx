import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (selectedCountry === null) {
      return
    }

    const capital = selectedCountry.capital[0]
    const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
      )
      .then(response => {
        setWeather(response.data)
      })
  }, [selectedCountry])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
    setWeather(null)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  if (countriesToShow.length > 10) {
    return (
      <div>
        <div>
          find countries{' '}
          <input
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  return (
    <div>
      <div>
        find countries{' '}
        <input
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {selectedCountry ? (
        <div>
          <h1>{selectedCountry.name.common}</h1>

          <p>
            capital {selectedCountry.capital}
          </p>

          <p>
            area {selectedCountry.area}
          </p>

          <h2>languages:</h2>

          <ul>
            {Object.values(selectedCountry.languages).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>

          <img
            src={selectedCountry.flags.png}
            alt={`Flag of ${selectedCountry.name.common}`}
            width="150"
          />

          {weather && (
            <div>
              <h2>Weather in {selectedCountry.capital[0]}</h2>

              <p>
                temperature {weather.main.temp} Celsius
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />

              <p>
                {weather.weather[0].description}
              </p>

              <p>
                wind {weather.wind.speed} m/s
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {countriesToShow.map(country => (
            <p key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setSelectedCountry(country)}>
                show
              </button>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default App