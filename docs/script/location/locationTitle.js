/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */

import { findMapLocation } from './mapConfigs.js';

function editLocationTitle(properties) {
  const locationInput = properties.address_line1;
  const { country } = properties;
  const currentLocation = document.querySelector('.location');

  // if location input is a country
  if (locationInput === country) {
    currentLocation.innerText = `${country}`;

    // else, show city with country name
  } else {
    currentLocation.innerText = `${locationInput}, ${country}`;
  }
}

function applyLocation(data) {
  const { properties } = data.features[0];

  findMapLocation(properties);
  editLocationTitle(properties);
}

export { applyLocation };
