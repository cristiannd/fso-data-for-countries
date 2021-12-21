import { useEffect, useState } from 'react'
import axios from 'axios'
import env from 'react-dotenv'

const ShowCountries = ({ filteredCountries, setFindCountry, weather }) => {
  if (filteredCountries.length > 10 || filteredCountries.length === 0) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length > 1) {
    return (
      <ul>
        {filteredCountries.map((e) => (
          <li key={e.name.common}>
            {e.name.common}{' '}
            <button onClick={() => setFindCountry(e.name.common)}>Show</button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <h2>{filteredCountries[0].name.common}</h2>
      <div>
        Capital: {filteredCountries[0].capital} <br />
        Population: {filteredCountries[0].population}
      </div>
      <h3>Languages</h3>
      <ul>
        {Object.values(filteredCountries[0].languages).map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      <img
        src={filteredCountries[0].flags.svg}
        alt={filteredCountries[0].flag}
        width="200px"
      />
      {weather !== undefined ? (
        <>
          <h3>Weather in {weather.location.country}</h3>
          <div>
            <strong>Temperature:</strong> {weather.current.temperature} °C{' '}
            <br />
            <img
              src={weather.current.weather_icons}
              alt={weather.current.weather_descriptions}
            />{' '}
            <br />
            <strong>Wind:</strong> {weather.current.wind_speed} mph direction{' '}
            {weather.current.wind_dir}
          </div>
        </>
      ) : null}
    </>
  )
}

const App = () => {
  const [dataCountries, setDataCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [findCountry, setFindCountry] = useState('')
  const [weather, setWeather] = useState({})

  // Get data countries
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((res) => setDataCountries(res.data))
  }, [])

  // Country filtering
  useEffect(() => {
    if (findCountry.length === 0) {
      return setFilteredCountries([])
    }

    const countries = dataCountries.filter((country) =>
      country.name.common.toLowerCase().includes(findCountry.toLowerCase())
    )
    setFilteredCountries(countries)
  }, [findCountry, dataCountries])

  // Get data Weather Stack
  useEffect(() => {
    if (filteredCountries.length === 1) {
      axios
        .get(
          `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${filteredCountries[0].name.common}`
        )
        .then((res) => setWeather(res))
    }
  }, [filteredCountries])

  const handleFindCountries = (e) => {
    setFindCountry(e.target.value)
  }

  return (
    <div>
      <h1>Data for countries</h1>
      find countries{' '}
      <input type="text" value={findCountry} onChange={handleFindCountries} />
      <ShowCountries
        filteredCountries={filteredCountries}
        setFindCountry={setFindCountry}
        weather={weather.data}
      />
    </div>
  )
}

export default App
