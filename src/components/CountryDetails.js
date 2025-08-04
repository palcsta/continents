import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'

const numberChanger = (number) => {
  if (number == null) return (<>-</>)
  let filtered = number.toString()
  // + " " + number.substring(1, 4) + " " + number.substring(5, 6)
  if (filtered.length === 4) filtered = (filtered.substring(0, 1) + " " + filtered.substring(1))
  else if (filtered.length === 5) filtered = (filtered.substring(0, 2) + " " + filtered.substring(2))
  else if (filtered.length === 6) filtered = (filtered.substring(0, 3) + " " + filtered.substring(3))
  else if (filtered.length === 7) filtered = (filtered.charAt(0) + " " + filtered.substring(1, 4) + " " + filtered.substring(4))
  else if (filtered.length === 8) filtered = (filtered.substring(0, 2) + " " + filtered.substring(2, 5) + " " + filtered.substring(5))
  else if (filtered.length === 9) filtered = (filtered.substring(0, 3) + " " + filtered.substring(3, 6) + " " + filtered.substring(6))
  else if (filtered.length === 9) filtered = (filtered.substring(0, 3) + " " + filtered.substring(3, 6) + " " + filtered.substring(6))
  else if (filtered.length === 10) filtered = (filtered.substring(0, 1) + " " + filtered.substring(1, 4) + " " + filtered.substring(4, 7) + " " + filtered.substring(7))
  return (<>{filtered}</>)

}

const toLeft = {
  "paddingLeft": "3em"
}


const CountryDetails = (props) => {
  if (props.countries !== undefined) {

    let color = "blue"
    if (props.showDetail) {
      let foundColorObj = props.mapColor.find(e => e.id === props.showDetail)
      if (foundColorObj) {
        color = foundColorObj.color
      }
    }

    const style = {
      display: 'flex',
      border: '3px solid ' + color,
      align: "center",
      "borderRadius": "10px"
    }

    const flag = {
      border: '2px solid black',
      "borderRadius": "5px",
      width: "175",
      height: "120"
    }
    //const relUrl = "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-religion.json"




    let country = props.countries.find(c => c.cca2.toLowerCase() === props.showDetail)
    let isSelected = props.selected.includes(props.showDetail)
    let rel = (country && props.religions) ? props.religions.filter(x => x.country == country.name.common) : "no religion data found"
    let currency = (country && props.currencies) ? props.currencies.filter(x => country.name.includes(x.country)) : "no currency data"

    function calcTime(/*city, */offset) {
      // console.log("offset ",isNaN(offset))

      // create Date object for current location
      let d = new Date();

      // convert to msec
      // add local time zone offset
      // get UTC time in msec
      let utc = d.getTime() + (d.getTimezoneOffset() * 60000);

      // create new Date object for different city
      // using supplied offset
      let nd = new Date()
      if (!isNaN(offset)) {
        nd = new Date(utc + (3600000 * offset));
      } else {
        nd = new Date(utc);
      }


      // return time as a string
      return nd.getHours() + ":" + nd.getMinutes()//"time is " + nd.toString();

    }




    //const [religion, setReligion] = useState(country ? props.religions.filter(x => x.country==country.name): "no religion data")
    //const [currency, setCurrency] = useState(" no currency data...")
    const deselectMe = () => {
      props.dkd(country.cca2.toLowerCase())
    }

    const selectMe = () => {
      props.selectOne(country.cca2.toLowerCase())
    }

    const content = () => {
      //() => selectMe()
      if (props.showDetail && country && rel) {
        //() => props.selectOne(country.cca2.toLowerCase())
        // console.log("REL is    ", rel)
        // setReligion(props.religions.filter(x => x.country==country.name))
        return (
          <>
            <div style={style}> <div><h2><a target="_blank" rel="noopener noreferrer"
              href={`https://en.wikipedia.org/wiki/${country.name.common}`}> {country.name.common}</a>({country.cca2}{country.nativeName == country.name.common ? "" : ", " + country.name.official + "" + ""},{country.flag})</h2>
              <b>capital:</b> {country.capital}</div>
              <Button style={{ margin: "1%" }} target="_blank" href={"https://yt-trends.iamrohit.in/" + country.name.common} variant={"danger"}>YouTube<br></br>trending<br></br></Button>
              <Button style={{ margin: "1%" }} target="_blank" href={country.maps.googleMaps} variant={"success"}>find in <br></br>Google Maps</Button>
              <Button style={{ margin: "1%" }} variant={isSelected ? "outline-warning" : "outline-primary"}
                onClick={() => { isSelected ? deselectMe() : selectMe() }}>{isSelected ? <>Deselect<br></br>on map</> : <>Select<br></br>on map</>}</Button>
            </div>

            <div style={style}>
              {<img style={flag} src={require("../../backup/flag/"+country.cca2.toLowerCase()+".svg")
                /*country.flags.svg*/} alt="" height="100" ></img>}

              <img style={flag}
                src={require("../../backup/coa/"+country.cca2.toLowerCase()+".svg")
                  /*`https://mainfacts.com/media/images/coats_of_arms/${country.cca2.toLowerCase()}.svg`*/}
                alt="" height="100" >
              </img>
              <div >
                <i><b>pop.</b></i>: {numberChanger(country.population)}
                <br></br>
                <b>area:</b> {numberChanger(country.area)} km<sup>2</sup>
                <br></br>
                <b>region:</b> {country.subregion}
                <br></br>
                <b>time:{""}</b>{
                  calcTime(country.timezones[0].substring(3, 6)[0] + country.timezones[0].substring(3, 6)[2])
                  
                }
              </div>

              <div>
                <div><b><i> <span style={toLeft}>language(s):</span></i></b>
                  {Object.values(country.languages).map(x => <>|
                    <a target="_blank" href={"https://wikipedia.org/wiki/" + x + "_language"} key={x}>{x}</a>| </>)}
                </div><div>
                  <n><b><span style={toLeft}>Religion:</span></b>{rel[0] !== undefined ? rel[0].religion : " no data "}</n>
                  <br></br>
                  <n><b><span style={toLeft}>Currency:</span></b>{/*currency[0] !== undefined ? currency[0].currency_code : "no data"*/
                    Object.values(country.currencies)[0].code
                  }{Object.values(country.currencies)[0].symbol == null ? "" : "(" + Object.values(country.currencies)[0].symbol + ")"}</n>
                  <br></br>
                  <><button hidden onClick={() => props.setShowDetail(null)}>hide</button></>
                </div>

              </div>

            </div>
          </>
        )
      } else {
        return (<></>)
      }
    }

    return (
      <>
        {content()}
      </>
    )
  } else { return (<>NO DATA in CountryDetails</>) }
}
export default CountryDetails
