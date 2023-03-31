import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('input#search-box'),
  countryList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};
const { countryInfo, countryList, searchBox } = refs;

// const UKR = fetchCountries(`ukraine`);
// console.dir(UKR);

const clearRefs = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};

const createCountriesListMarkup = data =>
  data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">  ${name.official}</li>`
    )
    .join('');

const createOneCountryMarkup = ([country]) => {
  const { name, flags, capital, population, languages } = country;

  return `<img src="${flags.png}" alt="${name.official}" width="200" height="100">
  <h1>${name.official}</h1>
  <p>Capital: ${capital}</p>
  <p>Population: ${population}</p>
  <p>Languages: ${Object.values(languages)}</p>`;
};

const checkData = data => {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (data.length > 1) {
    countryList.innerHTML = createCountriesListMarkup(data);
    return;
  }
  countryInfo.innerHTML = createOneCountryMarkup(data);
};

const showError = error =>
  Notify.failure(
    error.message === '404'
      ? 'Oops, there is no country with that name'
      : 'Oops, something went wrong'
  );

const findCountry = async name => {
  try {
    checkData(await fetchCountries(name));
  } catch (error) {
    showError(error);
  }
};

const onInput = ({ target }) => {
  const countryName = target.value.trim();
  clearRefs();
  if (!countryName) return;
  findCountry(countryName);
};

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
