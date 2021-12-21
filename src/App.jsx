import { useEffect, useState } from 'react'
import axios from 'axios'

const ShowCountries = ({ filteredCountries, setFindCountry }) => {
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
    </>
  )
}

const App = () => {
  const [dataCountries, setDataCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [findCountry, setFindCountry] = useState('')

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
      />
    </div>
  )
}

export default App
