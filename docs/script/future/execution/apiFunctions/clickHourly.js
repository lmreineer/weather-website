/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */

import {
  geoapify,
  visualCrossing,
  ipgeolocation,
} from '../../../apiKeys.js';

import { applyHourly } from '../../hourly.js';
import { removeAnimation } from '../../animation.js';

function checkWeather(lat, lon) {
  const weatherAPI = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${visualCrossing}`;

  fetch(weatherAPI)
    .then((response) => response.json())
    .then((weatherData) => {
      // get current hour
      const hourAPI = `https://api.ipgeolocation.io/astronomy?apiKey=${ipgeolocation}&lat=${lat}&long=${lon}`;

      fetch(hourAPI)
        .then((response) => response.json())
        .then((hourData) => {
          applyHourly(weatherData, hourData);
          // remove animation after applying infos
          removeAnimation();
        });
    });
}

const errorMessage = document.querySelector('.error');
const search = document.querySelector('.search');

// initialize hourly
function initHourly() {
  const geocodeAPI = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(search.value)}&apiKey=${geoapify}`;

  fetch(geocodeAPI)
    .then((response) => response.json())
    .then((locData) => {
      // if error is visible, stop operations
      if (errorMessage.style.visibility === 'visible') {
        removeAnimation();

        // else, show weather
      } else {
        const lat = locData.features[0].geometry.coordinates[1];
        const lon = locData.features[0].geometry.coordinates[0];
        checkWeather(lat, lon);
      }
    });
}

export {
  initHourly,
};
