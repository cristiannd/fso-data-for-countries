import { useEffect, useState } from 'react'
import axios from 'axios'

const ShowCountries = ({ filteredCountries }) => {
  if (filteredCountries.length > 10 || filteredCountries.length === 0) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length > 1) {
    return (
      <ul>
        {filteredCountries.map((e) => (
          <li key={e.name.common}>{e.name.common}</li>
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
      <img src={filteredCountries[0].flags.svg} alt={filteredCountries[0].flag} width="200px" />
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

  const handleFindCountries = (e) => {
    setFindCountry(e.target.value)

    const countries = dataCountries.filter((country) =>
      country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredCountries(countries)
  }

  return (
    <div>
      <h1>Data for countries</h1>
      find countries{' '}
      <input type="text" value={findCountry} onChange={handleFindCountries} />
      <ShowCountries filteredCountries={filteredCountries} />
    </div>
  )
}

export default App
