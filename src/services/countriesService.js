import axios from 'axios'

const countriesUrl = 'https://restcountries.com/v3.1/all' 

export const countriesService = async () => {
  try {
    const response = await axios.get(countriesUrl)
    console.log("Fetched countries from API")
    return response.data
  } catch (error) {
    console.log(`error fetching countries from ${countriesUrl}; trying local backup`)
    try {
      // Import at top level or dynamic import if needed, but require works in CRA
      const jsonData = require('../data/all.json');
      return jsonData;
    } catch (localError) {
      console.error(`error reading local json file; ${localError}`)
      return []
    }
  }
}
