import axios from 'axios'

const countriesUrl = 'https://restcountries.com/v3.1/all' 

export const countriesService = async () => {
  try {
    const response = await axios.get(countriesUrl)
    console.log("countries response data= ",response.data)
    return response.data
  } catch (error) {
    console.log(`error fetching countries from ${countriesUrl} ; ${error} ${error.response && error.response.data}`)
    console.log("trying to fetch local json backup file")
    try {
      const jsonData = require('../all.json');
      //console.log(JSON.parse(jsonData));
      return ((jsonData));


    } catch (error) {
      console.log(`error reading local json file ; ${error}`)
      return []
    }
  }
}
