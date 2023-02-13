/* eslint-disable import/extensions */
/* eslint-disable no-console */

import {
  addClass,
  removeClass,
  removeText,
} from '../main.js';

import {
  geoapify,
  visualCrossing,
  ipgeolocation,
} from './apiKeys.js';

import {
  applyLocation,
} from './location.js';

import {
  applyCurrently,
} from './weather/currentWeather.js';

import {
  applyDaily,
} from './weather/daily.js';

import {
  applyHourly,
} from './weather/hourly.js';

// check current weather
function checkCurrently(lat, lon) {
  const weatherAPI = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${visualCrossing}`;

  fetch(weatherAPI)
    .then((response) => response.json())
    .then((weatherData) => {
      // execute to check current weather
      applyCurrently(weatherData);
      // execute to initially apply daily weather forecast on first time page load
      applyDaily(weatherData);

      // initially use current hour API to check current hour and pick hours that is greater than it
      const hourAPI = `https://api.ipgeolocation.io/astronomy?apiKey=${ipgeolocation}&lat=${lat}&long=${lon}`;

      fetch(hourAPI)
        .then((response) => response.json())
        .then((hourData) => {
          // initially execute to apply hours that has not been passed yet by current hour
          applyHourly(weatherData, hourData);
        })
        .catch((error) => console.error(error));

      // remove preload animation when weather details are applied
      removeClass();
    })
    .catch((error) => console.error(error));
}

const search = document.querySelector('.search');
const loupe = document.querySelector('.fa-magnifying-glass');
const errorMessage = document.querySelector('.error');

// find latitude and longitude of location name based on input
function geocodeLocation() {
// add preload animation and remove existing text from HTML
  addClass();
  removeText();

  const geocodeAPI = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(search.value)}&apiKey=${geoapify}`;

  fetch(geocodeAPI)
    .then((response) => response.json())
    .then((locData) => {
      // assign latitude and longitude and use to execute current weather and time
      const lat = locData.features[0].geometry.coordinates[1];
      const lon = locData.features[0].geometry.coordinates[0];

      const countryInput = locData.query.parsed.country;
      const cityInput = locData.query.parsed.city;
      const locationsFound = locData.features.length;
      // show error if country is inputted but city is not inputted or no location results found
      if ((countryInput !== undefined && cityInput === undefined)
      || locationsFound === 0) {
        errorMessage.style.visibility = 'visible';
        removeClass();
        // hide error and check the weather otherwise
      } else {
        errorMessage.style.visibility = 'hidden';
        // execute to configure map location based on input
        applyLocation(locData);
        // then execute to check current weather
        checkCurrently(lat, lon);
      }
    })
    .catch((error) => console.error(error));
}

search.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    geocodeLocation();
  }
});

loupe.addEventListener('click', () => {
  if (search.value !== '') {
    geocodeLocation();
  }
});

export {
  search,
  geocodeLocation,
};
