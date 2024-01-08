import { useState, useEffect } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const Weather=({capital})=>{
  const api_key = import.meta.env.VITE_API_KEY
  const [weatherData, setWeather] = useState({})

  useEffect(() => {
    console.log('effect')
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then((response => {
        console.log('promise fullfilled')
        setWeather(response.data)
      }))
  }, [api_key, capital])

    const weather =weatherData.weather[0]
    const icon = weather.icon
    const temp = weatherData.main.temp
    const wind = weatherData.wind.speed

    return(
      <div>
      <h4>Weather in {capital}</h4>
      <p>temperature: {temp}Celcius </p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="weather icon" />
      <p>wind: {wind} m/s </p>
    </div>
    )
}

const Country=({country})=>{
  return(      
  <div key={country.name.common}>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages).map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />
    <Weather capital={country.capital}/>
  </div>)
}

function App() {
  const [countries, setCountries] =useState([])
  const [filter, setFilter]=useState('')

  useEffect(() => {
    console.log('effect')
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response=>{
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')
  const countriesToShow = countries.filter((country) =>
  country.name.common.toLowerCase().includes(filter.toLowerCase())

)

  const handleTextChange =(event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleCountry = () => {
    if (countriesToShow.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (countriesToShow.length === 1) {
      return <Country country={countriesToShow[0]}/>;
    } else {
      return countriesToShow.map((country) => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={()=>setFilter(country.name.common)}>show </button>
        </div>
    
        
   
      ));
    }
  }



  return (
    <>
    <div>
      find countries <input value={filter} onChange={handleTextChange} />
    </div>

    <div>{handleCountry()}</div>
    </>
  )
}

export default App
