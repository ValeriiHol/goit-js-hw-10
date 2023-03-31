const BASE_URL = 'https://restcountries.com/v3.1/name/';
const REQUIRED_FIELDS_COUNTRY = 'fields=name,capital,population,flags,languages';

export const fetchCountries = name => { 
    return fetch(`${BASE_URL}${name}?${REQUIRED_FIELDS_COUNTRY}`).then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  };