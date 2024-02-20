import React, { useEffect, useState } from 'react'

//import des icones
import airQualityIcon from "../assets/icons/airquality.svg"
import feelsLikeIcon from "../assets/icons/feelslike.svg"
import humidityIcon from "../assets/icons/humidity.svg"
import uvIcon from "../assets/icons/uv.svg"
import windIcon from "../assets/icons/wind.svg";
import nonprecip from '../assets/icons/nonPrecipitation.svg';
import precip from '../assets/icons/precipitation.svg';
import sunsetIcon from "../assets/icons/sunset.svg";
import sunriseIcon from "../assets/icons/sunrise.svg";

//import composant Ant Design et React Icons
import { Carousel, Radio } from 'antd';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatTime } from '../utils/dateUtils';

//import des composants
import WeatherSkeleton from '../components/WeatherSkeleton.js';
import Week from '../components/Week.js';
import Day from '../components/Day.js';
import HeaderNav from '../components/HeaderNav.js';
import DetailCard from '../components/DetailCard.js';
import Precipitation from '../components/Precipitation.js';
import CurrentCity from '../components/CurrentCity.js'
import Modal from '../components/Modal.js'


//import des feuilles de styles
import '../main.css';
import "../stylesheet/Root.scss";
import '../stylesheet/carrousel.scss';


// const contentStyle = {
//   height: '300px',
//   lineHeight: '300px',
//   textAlign: 'center',
// };


const App = () => {

  //météo a l'instant T
  const [currentWeather, setCurrentWeather] = useState({});
  //météo prévisions 24h (pluie et heure par heure)
  const [forecastWeather, setForecastWeather] = useState({});
  //météo prévisions 7 (jour-temps-icon)
  const [forecastWeather7, setForecastWeather7] = useState({});

  //état de la navBar à false, passe à true au clik sur la ville
  const [showNavBar, setShowNavBar] = useState(false);
  //menu input pour saisie de la ville
  const [weatherInput, setWeatherInput] = useState('');
  //div Détails Météo qui n'apparait qu'au clik sur mobile, et qui est en display sur tablette et desktop
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  //modal Infos Prévisions
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  const [loadingCity, setLoadingCity] = useState(false);
  const [dotPosition, setDotPosition] = useState('right');
  const handlePositionChange = ({ target: { value } }) => {
    setDotPosition(value);
  };

  //Recupération du Meme
  const [memes, setMemes] = useState([]);
  //Récupération du son
  const [musiques, setMusiques] = useState([]);
  //Constante pour filtrer les sons
  const [selectedMusique, setSelectedMusique] = useState(null);
  //Constante pour filtrer les memes
  const [selectedMeme, setSelectedMeme] = useState(null);
  // Constante pour stocker le texte des conditions météos actuelles
  const currentWeatherText = currentWeather?.current?.condition?.text;
  console.log(currentWeatherText);
  //Fetch pour aller chercher les memes sur notre API
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('http://localhost:7000/memes');
        const data = await response.json();
        setMemes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des memes:', error);
      }
    };

    fetchMemes();
  }, []);
  //Fetch pour aller chercher les sons sur notre API
  useEffect(() => {
    const fetchMusiques = async () => {
      try {
        const response = await fetch('http://localhost:7000/musiques');
        const data = await response.json();
        setMusiques(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des musiques:', error);
      }
    };

    fetchMusiques();
  }, []);
  
  //Conditionnement pour que la description de la condition météo soit le meme que le nom du meme. 
  useEffect(() => {
    const weatherMemeMap = {
      'Sunny': 'sun',
      'Partly cloudy': 'cloudy',
      'Cloudy': 'cloudy',
      'Overcast': 'cloudy',
      'Patchy rain possible': 'rain',
      'Moderate or heavy freezing rain': 'rain',
      'Light freezing rain': 'rain',
      'Heavy rain': 'rain',
      'Heavy rain at times': 'rain',
      'Moderate rain': 'rain',
      'Moderate rain at times': 'rain',
      'Light rain': 'rain',
      'Light rain shower': 'rain',
      'Moderate or heavy rain shower': 'rain',
      'Patchy light rain': 'rain',
      'Torrential rain shower': 'rain',
      'Wind': 'wind',
      'Blowing snow': 'snow',
      'Patchy snow possible': 'snow',
      'Patchy sleet possible': 'snow',
      'Blizzard': 'snow',
      'Light snow showers': 'snow',
      'Moderate or heavy snow showers': 'snow',
      'Patchy light snow with thunder': 'snow',
      'Moderate or heavy snow with thunder': 'snow',
      'Moderate or heavy sleet': 'snow',
      'Patchy light snow': 'snow',
      'Light snow': 'snow',
      'Patchy moderate snow': 'snow',
      'Moderate snow': 'snow',
      'Patchy heavy snow': 'snow',
      'Heavy snow': 'snow',
      'Patchy freezing drizzle possible': 'freezing',
      'Freezing drizzle': 'freezing',
      'Light sleet': 'freezing',
      'Light sleet showers': 'freezing',
      'Moderate or heavy sleet showers': 'freezing',
      'Light showers of ice pellets': 'freezing',
      'Ice pellets': 'verglas',
      'Thundery outbreaks possible': 'thunderstorm',
      'Patchy light rain with thunder': 'thunderstorm',
      'Moderate or heavy rain with thunder': 'thunderstorm',
      'Heatwave': 'heatwave',
      'Fog': 'fog',
      'Mist': 'fog',
      'Freezing fog': 'fog',
      'Patchy light drizzle': 'fog',
      'Light drizzle': 'fog',
    };

    if (currentWeatherText && memes.length > 0) {
      const filteredMemes = memes.filter(meme => {
        const memeName = weatherMemeMap[currentWeatherText];
        return memeName && meme.name.toLowerCase() === memeName;
      });

      if (filteredMemes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredMemes.length);
        const randomMeme = filteredMemes[randomIndex];
        setSelectedMeme(randomMeme);
      } else {
        setSelectedMeme(null);
      }
    } else {
      setSelectedMeme(null);
    }
  }, [currentWeatherText, memes]);

  //Conditionnement pour que la description de la condition météo soit le meme que le nom du son.
  useEffect(() => {
    const weatherSoundMap = {
      'Sunny': 'sun',
      'Partly cloudy': 'cloudy',
      'Cloudy': 'cloudy',
      'Overcast': 'cloudy',
      'Patchy rain possible': 'rain',
      'Moderate or heavy freezing rain': 'rain',
      'Light freezing rain': 'rain',
      'Heavy rain': 'rain',
      'Heavy rain at times': 'rain',
      'Moderate rain': 'rain',
      'Moderate rain at times': 'rain',
      'Light rain': 'rain',
      'Light rain shower': 'rain',
      'Moderate or heavy rain shower': 'rain',
      'Patchy light rain': 'rain',
      'Torrential rain shower': 'rain',
      'Wind': 'wind',
      'Blowing snow': 'snow',
      'Patchy snow possible': 'snow',
      'Patchy sleet possible': 'snow',
      'Blizzard': 'snow',
      'Light snow showers': 'snow',
      'Moderate or heavy snow showers': 'snow',
      'Patchy light snow with thunder': 'snow',
      'Moderate or heavy snow with thunder': 'snow',
      'Moderate or heavy sleet': 'snow',
      'Patchy light snow': 'snow',
      'Light snow': 'snow',
      'Patchy moderate snow': 'snow',
      'Moderate snow': 'snow',
      'Patchy heavy snow': 'snow',
      'Heavy snow': 'snow',
      'Patchy freezing drizzle possible': 'freezing',
      'Freezing drizzle': 'freezing',
      'Light sleet': 'freezing',
      'Light sleet showers': 'freezing',
      'Moderate or heavy sleet showers': 'freezing',
      'Light showers of ice pellets': 'freezing',
      'Ice pellets': 'verglas',
      'Thundery outbreaks possible': 'thunderstorm',
      'Patchy light rain with thunder': 'thunderstorm',
      'Moderate or heavy rain with thunder': 'thunderstorm',
      'Heatwave': 'heatwave',
      'Fog': 'fog',
      'Mist': 'fog',
      'Freezing fog': 'fog',
      'Patchy light drizzle': 'fog',
      'Light drizzle': 'fog',
    };

    if (currentWeatherText && musiques.length > 0) {
      const musiqueName = weatherSoundMap[currentWeatherText];
      const selectedMusique = musiques.find(musiques => musiques.name.toLowerCase() === musiqueName);

      setSelectedMusique(selectedMusique || null);
    } else {
      setSelectedMusique(null);
    }
  }, [currentWeatherText, musiques]);

   //fetch current data weather
   useEffect(() => {
    const weatherData = async () => {
      let apiUrl;
      if (weatherInput) {
        apiUrl = `http://api.weatherapi.com/v1/current.json?key=5929e663f6c74ae192890247240802&q=${weatherInput}&aqi=yes&lang=fr`;
      } else {
        apiUrl = `http://api.weatherapi.com/v1/current.json?key=5929e663f6c74ae192890247240802&q=Lille&aqi=yes&lang=fr`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      setCurrentWeather(data);
    };
  
    weatherData();
  }, [weatherInput]);

  /*fetch forecast 24h*/
  useEffect(() => {
    const weatherDataForecast = async () => {
      let apiUrl;
      if (weatherInput) {
        apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=5929e663f6c74ae192890247240802&q=${weatherInput}&days=1&aqi=yes&alerts=yes`;
      } else {
        apiUrl = 'http://api.weatherapi.com/v1/forecast.json?key=5929e663f6c74ae192890247240802&q=Lille&days=1&aqi=yes&alerts=yes';
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      setForecastWeather(data);
      console.log("Nouvelles données de prévisions 24h :", data);
    };
    weatherDataForecast();
  }, [weatherInput]);

  /*fetch forecast 5jrs*/
  useEffect(() => {
    const weatherForecast7 = async () => {
      let apiUrl;
      if (weatherInput) {
        apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=5929e663f6c74ae192890247240802&q=${weatherInput}&days=7&aqi=no&alerts=yes`;
      } else {
        apiUrl = 'http://api.weatherapi.com/v1/forecast.json?key=5929e663f6c74ae192890247240802&q=Lille&days=7&aqi=no&alerts=yes';
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      setForecastWeather7(data);
      console.log("Nouvelles données de prévisions 7 jours :", data);
    };
    weatherForecast7();
  }, [weatherInput]);


  /*Navbar qui apparait au clik avec l'input pour la saisie d'une ville*/
  const handleCityClick = () => {
    console.log("déclenché");
    setShowNavBar(true);
  }
  //saisie input et à la soumission la Navbar disparait
  const handleWeatherInput = async (city) => {
    // Appel de l'API avec la city soumise dans la nav
    setWeatherInput(city);
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=5929e663f6c74ae192890247240802&q=${city}&aqi=yes`);
      const data = await response.json();
      setCurrentWeather(data);
      setShowNavBar(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo:', error);
    }
  };

  /*icone pour details Météo (mobile => on clik ; tablette/desktop => display)*/
  const handleMobileIconClick = () => {
    setShowMobileDetails(!showMobileDetails);
  };


  /* geolocalisation */
  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLoadingCity(true);
        setWeatherInput('');
        try {
          const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=5929e663f6c74ae192890247240802&q=${latitude},${longitude}&aqi=yes`).then(response => response.json());
          setTimeout(() => {
            const data = response;
            setCurrentWeather(data);
            setLoadingCity(false);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }

  // Au clik sur la div week dans le Carousel, la modal apparait avec les previsions du jour Selected (température max et min, précipitations, vent)
  const handleDayClick = (day) => {
    const maxTemp = day.day.maxtemp_c;
    const minTemp = day.day.mintemp_c;
    const rain = day.day.totalprecip_mm;
    const wind = day.day.maxwind_kph;

    setSelectedDayInfo({ maxTemp, minTemp, rain, wind });
};

const handleCloseModal = () => {
    setSelectedDayInfo(null);
};

  // const onChange = (currentSlide) => {
  //   console.log(currentSlide);
  // };

  ///// Carrousel page 1 pour la météo des 5 prochains jours /////
  const days = forecastWeather7.forecast?.forecastday?.map((day, index) => (
    <div className="week" key={index}>
        <Week
            name={format(new Date(day.date), 'EEEE', { locale: fr })}
            weather={day.day.condition.code}
            temperature={day.day.avgtemp_c}
            onClick={() => handleDayClick(day)}
        />
    </div>
));

  ///// Carrousel page 2 pour la météo des 24 prochaines heures /////
  const hours = forecastWeather.forecast && forecastWeather.forecast.forecastday && forecastWeather.forecast.forecastday.map((day, index) =>
  (
    <div className="MiniCards" key={index}>
      {day.hour.map((hour, index) => (
        <Day
          key={index}
          time={formatTime(hour.time)}
          weather={`http:${hour.condition.icon}`}
          temperature={hour.temp_c}
        />
      ))}
    </div>
  ))

  ///// Carrousel page 3 pour les précipitations des 24 prochaines heures /////
  const minutes = forecastWeather && forecastWeather.forecast && forecastWeather.forecast.forecastday &&
    forecastWeather.forecast.forecastday.map((day, index) =>
    (
      <div className="precip" key={index}>
        {day.hour.map((hour, idx) => (
          <Precipitation
            key={idx}
            minutes={formatTime(hour.time)}
            rain={hour.chance_of_rain > 0 ? (
              <img src={precip} alt="Precipitating" />) :
              (<img src={nonprecip} alt="Not Precipitating" />)}
          />
        ))}
      </div>
    )
    )


    const sunDisplay = forecastWeather && forecastWeather.forecast && forecastWeather.forecast.forecastday &&
    forecastWeather.forecast.forecastday.map((day) => 
       (
        <div className='sun-display'>
          <div className='sun-group'>
            <img src={sunriseIcon} alt="" className='sun-icons'/>
            <p>{day.astro["sunrise"]}</p>
          </div>
          <div className='sun-group'>
            <img src={sunsetIcon} alt="" className='sun-icons'/>
            <p>{day.astro["sunset"]}</p>
          </div>
        </div>
      )
    );



  // Utilisation du WeatherSkeleton si loadingCity (chargement de la ville) = true
  if (loadingCity) {
    return <WeatherSkeleton />;
  } else {
    return (
      <div className="container">

        {/* Composant Navbar qui n'apparait que si on clik sur la ville */}
        {showNavBar && <HeaderNav onWeatherInput={handleWeatherInput} />}

        {/* Composant qui reprend le display de la ville actuelle (Location Name, Current Temp, et Icon Display*/}
        <CurrentCity 
        currentWeather={forecastWeather}  
        handleCityClick={handleCityClick} 
        handleMobileIconClick={handleMobileIconClick}
        />
    
        {/* Div des détails de la météo en display si tablette et desktop, OU apparait au clik sur l'icone pour les teléphones*/}
        <div className={`weather-details ${showMobileDetails ? 'show-mobile' : ''}`}>
          {/* Contenu des détails de la météo */}
          <div className="forecast">
            <div className='forecast-details'>
              <DetailCard iconSrc={windIcon} description="Vitesse du vent" value={`${currentWeather?.current?.wind_kph} km/h`} />
              <DetailCard iconSrc={humidityIcon} description="Humidité" value={`${currentWeather?.current?.humidity} %`} />
              <DetailCard iconSrc={uvIcon} description="Indice UV" value={currentWeather?.current?.uv} />
              <DetailCard iconSrc={feelsLikeIcon} description="Ressenti" value={`${currentWeather?.current?.feelslike_c} °C`} />
              <DetailCard iconSrc={airQualityIcon} description="Qualité de l'air" value={`indice ${currentWeather?.current?.air_quality['gb-defra-index']}`} />
            </div>
          </div>
        </div>

        <div className="weather-meme">
          {selectedMeme && (
            <div>
              <img src={selectedMeme.image} alt={selectedMeme.name} class="meme-display"/>
            </div>
          )}
          {selectedMusique && (
            <div>
              <audio src={selectedMusique.musique} autoPlay />
            </div>
          )}
        </div>

        <div className='carousel-container'>
          <Radio.Group
            onChange={handlePositionChange}
            value={dotPosition}
            style={{
              marginBottom: 8,
            }}
          >
          </Radio.Group>
            
          <Carousel dotPosition={dotPosition}>
            <div>
              <p>Temps sur 7 jours</p>
              <div className="week">
                {days}
              </div>
            </div>


            <div>
              <p>Temps sur 24h</p>
              {/* Mini composant display sun set et sun rise */}
              {/* forecastWeather.forecast.forecastday.map((astro), index => { 
                <div> <p>astro.sunrise</p> <p>astro.sunset</p> }) */}
                {sunDisplay}
              <div className="MiniCards">
                {hours}
              </div>
            </div>

            <div>
              <p>Précipitations dans l'heure</p>
              <div className="precip">
                {minutes}
              </div>
            </div>


          </Carousel>
        </div>
        <>
        {selectedDayInfo && <Modal onClose={handleCloseModal} dayInfo={selectedDayInfo} />}
        </>
      </div>

    )
  }
}


export default App