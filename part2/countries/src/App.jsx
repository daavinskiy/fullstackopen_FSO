import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
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

      <div>
        {countriesToShow.map(country => (
          <p key={country.cca3}>
            {country.name.common}
          </p>
        ))}
      </div>
    </div>
  )
}

export default App