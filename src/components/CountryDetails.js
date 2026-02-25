import React from 'react'
import Button from 'react-bootstrap/Button'

const numberChanger = (number) => {
  if (number == null) return (<>-</>)
  let filtered = number.toString()
  if (filtered.length === 4) filtered = (filtered.substring(0, 1) + " " + filtered.substring(1))
  else if (filtered.length === 5) filtered = (filtered.substring(0, 2) + " " + filtered.substring(2))
  else if (filtered.length === 6) filtered = (filtered.substring(0, 3) + " " + filtered.substring(3))
  else if (filtered.length === 7) filtered = (filtered.charAt(0) + " " + filtered.substring(1, 4) + " " + filtered.substring(4))
  else if (filtered.length === 8) filtered = (filtered.substring(0, 2) + " " + filtered.substring(2, 5) + " " + filtered.substring(5))
  else if (filtered.length === 9) filtered = (filtered.substring(0, 3) + " " + filtered.substring(3, 6) + " " + filtered.substring(6))
  else if (filtered.length === 10) filtered = (filtered.substring(0, 1) + " " + filtered.substring(1, 4) + " " + filtered.substring(4, 7) + " " + filtered.substring(7))
  return (<>{filtered}</>)
}

const toLeft = {
  "paddingLeft": "3em"
}

const CountryDetails = (props) => {
  if (props.countries === undefined) return (<>NO DATA in CountryDetails</>)

  let color = "blue"
  if (props.showDetail) {
    let foundColorObj = props.mapColor.find(e => e.id === props.showDetail)
    if (foundColorObj) {
      color = foundColorObj.color
    }
  }

  const textColor = props.mode ? 'black' : '#f8f9fa'
  const linkColor = props.mode ? '#007bff' : '#4dabff'

  const style = {
    display: 'flex',
    border: '3px solid ' + color,
    align: "center",
    "borderRadius": "10px",
    color: textColor
  }

  const flagStyle = {
    border: '2px solid black',
    "borderRadius": "5px",
    width: "175px",
    height: "120px",
    objectFit: "cover",
    margin: "5px"
  }

  const coaStyle = {
    width: "120px",
    height: "120px",
    objectFit: "contain",
    margin: "5px"
  }

  let country = props.countries.find(c => c.cca2.toLowerCase() === props.showDetail)
  let isSelected = props.selected.includes(props.showDetail)
  let rel = (country && props.religions) ? props.religions.filter(x => x.country === country.name.common) : []
  
  let currencyData = "no currency data"
  if (country && country.currencies) {
    const currencies = Object.values(country.currencies)
    if (currencies.length > 0) {
      const first = currencies[0]
      currencyData = `${first.name || first.code || ''} ${first.symbol ? '(' + first.symbol + ')' : ''}`
    }
  }

  function calcTime(offsetHours) {
    if (offsetHours === undefined || offsetHours === null) return "N/A"
    let d = new Date()
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000)
    let nd = new Date(utc + (3600000 * offsetHours))
    return nd.getHours() + ":" + (nd.getMinutes() < 10 ? '0' : '') + nd.getMinutes()
  }

  const getLocalAsset = (type, cca2) => {
    if (!cca2) return null
    try {
      return require(`../../backup/${type}/${cca2.toLowerCase()}.svg`)
    } catch (e) {
      if (country) {
        if (type === 'flag' && country.flags) return country.flags.svg || country.flags.png
        if (type === 'coa' && country.coatOfArms) return country.coatOfArms.svg || country.coatOfArms.png
      }
      return null
    }
  }

  const isWater = props.showDetail && (props.showDetail.includes('ocean') || props.showDetail.includes('sea'))
  
  if (isWater) {
    const name = props.showDetail.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const type = props.showDetail.includes('ocean') ? 'Ocean' : 'Sea'
    return (
      <div style={style}>
        <div>
          <h2>{name}</h2>
          <b>Classification:</b> {type}
          <br />
          <p>This is a major geographic body of water.</p>
        </div>
      </div>
    )
  }

  if (props.showDetail && country) {
    const capital = country.capital ? country.capital[0] : "N/A"
    const languages = country.languages ? Object.values(country.languages) : []
    const subregion = country.subregion || "N/A"
    const timezone = (country.timezones && country.timezones[0]) ? country.timezones[0] : ""
    
    let offset = 0
    if (timezone.includes('UTC')) {
      const match = timezone.match(/UTC([+-]\d+)(:(\d+))?/)
      if (match) {
        const hours = parseInt(match[1])
        const minutes = match[3] ? parseInt(match[3]) : 0
        offset = hours + (minutes / 60) * (hours < 0 ? -1 : 1)
      }
    }

    const flagUrl = getLocalAsset('flag', country.cca2)
    const coaUrl = getLocalAsset('coa', country.cca2)

    return (
      <>
        <div style={style}>
          <div>
            <h2>
              <a target="_blank" rel="noopener noreferrer" style={{ color: linkColor }} href={`https://en.wikipedia.org/wiki/${country.name.common}`}>
                {country.name.common}
              </a> ({country.cca2}{country.nativeName === country.name.common ? "" : ", " + (country.name.official || "")},{country.flag})
            </h2>
            <b>capital:</b> {capital}
          </div>
          <Button style={{ margin: "1%" }} target="_blank" href={"https://yt-trends.iamrohit.in/" + country.name.common} variant={"danger"}>YouTube<br />trending</Button>
          <Button style={{ margin: "1%" }} target="_blank" href={country.maps ? country.maps.googleMaps : "#"} variant={"success"}>find in <br />Google Maps</Button>
          <Button style={{ margin: "1%" }} variant={isSelected ? "outline-warning" : "outline-primary"}
            onClick={() => { isSelected ? props.dkd(country.cca2.toLowerCase()) : props.selectOne(country.cca2.toLowerCase()) }}>
            {isSelected ? <>Deselect<br />on map</> : <>Select<br />on map</>}
          </Button>
        </div>

        <div style={style}>
          {flagUrl && <img style={flagStyle} src={flagUrl} alt={`${country.name.common} flag`} />}
          {coaUrl && <img style={coaStyle} src={coaUrl} alt={`${country.name.common} coat of arms`} />}
          
          <div>
            <i><b>pop.</b></i>: {numberChanger(country.population)}
            <br />
            <b>area:</b> {numberChanger(country.area)} km<sup>2</sup>
            <br />
            <b>region:</b> {subregion}
            <br />
            <b>time: </b>{calcTime(offset)}
          </div>

          <div>
            <div>
              <b><i><span style={toLeft}>language(s):</span></i></b>
              {languages.length > 0 ? languages.map((x, i) => (
                <React.Fragment key={x}>
                  | <a target="_blank" rel="noopener noreferrer" style={{ color: linkColor }} href={"https://wikipedia.org/wiki/" + x + "_language"}>{x}</a>
                  {i === languages.length - 1 ? ' |' : ''}
                </React.Fragment>
              )) : " N/A"}
            </div>
            <div>
              <b><span style={toLeft}>Religion:</span></b> {rel[0] !== undefined ? rel[0].religion : " no data "}
              <br />
              <b><span style={toLeft}>Currency:</span></b> {currencyData}
              <br />
              <button hidden onClick={() => props.setShowDetail(null)}>hide</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return null
}

export default CountryDetails
