import React from 'react'
import Button from 'react-bootstrap/Button'
import { numberChanger } from '../utils/formatters'
import { useCountry } from '../context/CountryContext'

const CountryDetails = () => {
  const { 
    countries, 
    religions, 
    showDetail, 
    mapColor, 
    selected, 
    selectOne, 
    deselectOne, 
    mode,
    mobileView 
  } = useCountry();

  if (!countries) return (<>NO DATA in CountryDetails</>)

  let color = "blue"
  if (showDetail) {
    let foundColorObj = mapColor.find(e => e.id === showDetail)
    if (foundColorObj) {
      color = foundColorObj.color
    }
  }

  const textColor = mode ? 'black' : '#f8f9fa'
  const linkColor = mode ? '#007bff' : '#4dabff'

  const style = {
    display: 'grid',
    border: (mobileView ? '2px solid ' : '3px solid ') + color,
    borderRadius: '10px',
    color: textColor,
    padding: mobileView ? '6px 8px' : '8px 12px',
    marginBottom: mobileView ? '6px' : '8px',
    gap: mobileView ? '6px' : '10px',
    fontSize: mobileView ? '0.85rem' : '0.95rem',
    gridTemplateColumns: mobileView ? '1fr' : 'minmax(0, 1.7fr) auto',
    alignItems: 'start'
  }

  const flagStyle = {
    border: '1px solid ' + (mode ? '#333' : '#eee'),
    borderRadius: '4px',
    maxWidth: mobileView ? '72px' : '160px',
    maxHeight: mobileView ? '48px' : '96px',
    width: 'auto',
    height: 'auto',
    margin: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }

  const coaStyle = {
    maxWidth: mobileView ? '36px' : '72px',
    maxHeight: mobileView ? '36px' : '72px',
    width: 'auto',
    height: 'auto',
    margin: 0
  }

  let country = countries.find(c => c.cca2.toLowerCase() === showDetail)
  let isSelected = selected.includes(showDetail)
  let rel = (country && religions) ? religions.filter(x => x.country === country.name.common) : []
  
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

  const isWater = showDetail && (showDetail.includes('ocean') || showDetail.includes('sea'))
  
  if (isWater) {
    const name = showDetail.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const type = showDetail.includes('ocean') ? 'Ocean' : 'Sea'
    return (
      <div style={style}>
        <div>
          <h2 style={{ fontSize: mobileView ? '1rem' : '1.25rem', marginBottom: '4px', lineHeight: 1.1 }}>{name}</h2>
          <b>Classification:</b> {type}
          <br />
          <p style={{ margin: 0 }}>This is a major geographic body of water.</p>
        </div>
      </div>
    )
  }

    if (showDetail && country) {
    const capital = country.capital ? country.capital[0] : "N/A"
    const languages = country.languages ? Object.values(country.languages) : []
    const subregion = country.subregion || "N/A"
    
    const getBestTimezone = (c) => {
      if (!c.timezones || c.timezones.length === 0) return null;
      if (c.timezones.length === 1) return c.timezones[0];
      
      if (c.capitalInfo && c.capitalInfo.latlng && c.capitalInfo.latlng.length > 1) {
        const lon = c.capitalInfo.latlng[1];
        const estimatedOffset = lon / 15;
        
        let bestTz = c.timezones[0];
        let minDiff = Infinity;
        
        c.timezones.forEach(tz => {
          const match = tz.match(/UTC([+-]\d+)(:(\d+))?/);
          if (match) {
            const hours = parseInt(match[1]);
            const minutes = match[3] ? parseInt(match[3]) : 0;
            const offset = hours + (minutes / 60) * (hours < 0 ? -1 : 1);
            
            const diff = Math.abs(estimatedOffset - offset);
            if (diff < minDiff) {
              minDiff = diff;
              bestTz = tz;
            }
          }
        });
        return bestTz;
      }
      return c.timezones[0];
    };

    const timezone = getBestTimezone(country) || ""
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
      <div style={style}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: mobileView ? '1fr' : 'auto 1fr',
            gap: mobileView ? '6px' : '10px',
            alignItems: 'start'
          }}>
            <div style={{
              display: 'flex',
              gap: mobileView ? '6px' : '10px',
              alignItems: 'center',
              flexWrap: 'nowrap'
            }}>
              {flagUrl && <img style={flagStyle} src={flagUrl} alt={`${country.name.common} flag`} />}
              {coaUrl && <img style={coaStyle} src={coaUrl} alt={`${country.name.common} coat of arms`} />}
            </div>

            <div style={{ minWidth: 0 }}>
              <h2 style={{
                fontSize: mobileView ? '1rem' : '1.2rem',
                margin: 0,
                lineHeight: 1.15
              }}>
                <a target="_blank" rel="noopener noreferrer" style={{ color: linkColor }} href={`https://en.wikipedia.org/wiki/${country.name.common}`}>
                  {country.name.common}
                </a> ({country.cca2}{country.nativeName === country.name.common ? "" : ", " + (country.name.official || "")},{country.flag})
              </h2>
              <div style={{ marginTop: '2px' }}>
                <b>cap.</b>: {capital}
              </div>
              <div style={{ marginTop: '2px' }}>
                <i><b>pop.</b></i>: {numberChanger(country.population)} | <b>area:</b> {numberChanger(country.area)} km<sup>2</sup> | <b>reg:</b> {subregion} | <b>time:</b> {calcTime(offset)}
              </div>
              <div style={{ marginTop: '2px' }}>
                <b><i>language(s):</i></b>
                {languages.length > 0 ? languages.map((x, i) => (
                  <React.Fragment key={x}>
                    {i === 0 ? ' ' : ' | '}
                    <a target="_blank" rel="noopener noreferrer" style={{ color: linkColor }} href={"https://wikipedia.org/wiki/" + x + "_language"}>{x}</a>
                  </React.Fragment>
                )) : " N/A"}
              </div>
              <div style={{ marginTop: '2px' }}>
                <b>Religion:</b> {rel[0] !== undefined ? rel[0].religion : "no data"} | <b>Currency:</b> {currencyData}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: mobileView ? 'row' : 'column',
          justifyContent: mobileView ? 'flex-start' : 'center',
          alignItems: mobileView ? 'stretch' : 'flex-end',
          gap: '6px',
          flexWrap: mobileView ? 'wrap' : 'nowrap'
        }}>
          <Button target="_blank" href={"https://kworb.net/youtube/trending/" + country.cca2.toLowerCase() + ".html"} variant={"danger"} size={"sm"}>YouTube</Button>
          <Button target="_blank" href={country.maps ? country.maps.googleMaps : "#"} variant={"success"} size={"sm"}>Maps</Button>
          <Button variant={isSelected ? "outline-warning" : "outline-primary"} size={"sm"}
            onClick={() => { isSelected ? deselectOne(country.cca2.toLowerCase()) : selectOne(country.cca2.toLowerCase()) }}>
            {isSelected ? <>Deselect</> : <>Select</>}
          </Button>
        </div>
      </div>
    )
  }

  return null
}

export default CountryDetails
