/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable no-console */

import {
  geoapify,
  visualCrossing,
  ipgeolocation,
} from '../../../apiKeys.js';

import {
  applyHourly,
} from '../../hourly.js';

import {
  removeAnimation,
} from '../../animations.js';

// check current weather
function checkWeather(lat, lon) {
  const weatherAPI = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${visualCrossing}`;

  fetch(weatherAPI)
    .then((response) => response.json())
    .then((weatherData) => {
      // use current hour API to see current hour and pick hours that is greater than it
      const hourAPI = `https://api.ipgeolocation.io/astronomy?apiKey=${ipgeolocation}&lat=${lat}&long=${lon}`;

      fetch(hourAPI)
        .then((response) => response.json())
        .then((hourData) => {
          // initially execute to apply hours that has not been passed yet by current hour
          applyHourly(weatherData, hourData);

          // remove animation after applying details
          removeAnimation();
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
}

const search = document.querySelector('.search');

// initialize hourly
function initHourly() {
  const geocodeAPI = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(search.value)}&apiKey=${geoapify}`;

  fetch(geocodeAPI)
    .then((response) => response.json())
    .then((locData) => {
      // assign latitude and longitude and use to execute time
      const lat = locData.features[0].geometry.coordinates[1];
      const lon = locData.features[0].geometry.coordinates[0];

      checkWeather(lat, lon);
    })
    .catch((error) => console.error(error));
}

export {
  initHourly,
};