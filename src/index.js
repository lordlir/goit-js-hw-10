import debounce from 'lodash.debounce';
import Notiflix, { Notify } from 'notiflix';

import './css/styles.css';
import { fetchCountries } from './api/fethCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  enterName: document.querySelector('#search-box'),

  listOfCountry: document.querySelector('.country-list'),

  aboutCountry: document.querySelector('.country-info'),
};

const clearMarkup = ref => (ref.innerHTML = '');

function inputHendler(e) {
  const inputValue = e.target.value.trim();
  //   console.log(inputValue);
  if (!inputValue) {
    clearMarkup(refs.listOfCountry);
    clearMarkup(refs.aboutCountry);
    return;
  }

  fetchCountries(inputValue)
    .then(data => {
      //   console.log(data);
      if (data.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      }
      renderMarkup(data);
    })
    .catch(err => {
      clearMarkup(refs.listOfCountry);
      clearMarkup(refs.aboutCountry);
      Notify.failure('Oops, there is no country with that name');
    });
}

const renderMarkup = data => {
  if (data.length === 1) {
    clearMarkup(refs.listOfCountry);
    const infoMarkup = createMarkup(data);
    refs.aboutCountry.innerHTML = infoMarkup;
  } else {
    clearMarkup(refs.aboutCountry);
    const markupList = createListMarkup(data);
    refs.listOfCountry.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const createMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) => `<img src="${
      flags.png
    }" alt="${name.official}" width="200" height="200">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

refs.enterName.addEventListener(
  'input',
  debounce(inputHendler, DEBOUNCE_DELAY)
);
