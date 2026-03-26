import React, { useState } from 'react'
import '../styles/SelectedFlags.css'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import { useCountry } from '../context/CountryContext'

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

const SelectedFlags = () => {
  const { countries, selected, mapColor, setShowDetail, mode } = useCountry();
  
  let countriesToShowFlagsFor = countries.filter(x => selected.includes(x.cca2.toLowerCase()))
  const [sortMethod, setSortMethod] = useState('population');

  const getColor = (a2) => {
    let myColorObj = mapColor.find(z => z.id.toLowerCase() === a2.toLowerCase())
    return myColorObj ? myColorObj.color : "red"
  }

  const sortedList = [...countriesToShowFlagsFor].sort((a, b) => {
    if (sortMethod === 'population') return parseFloat(b.population) - parseFloat(a.population);
    if (sortMethod === 'area') return parseFloat(b.area) - parseFloat(a.area);
    if (sortMethod === 'name') return a.name.common.localeCompare(b.name.common);
    return 0;
  });

  const textColor = mode ? 'black' : '#f8f9fa'

  if (countriesToShowFlagsFor.length === 0) return null;

  return (
    <div style={{ color: textColor }}>
      <div style={{ "textAlign": "right", "margin": "0.2em" }}>
        <p style={{ "display": "inline", "margin": "0.2em 0.5em 0.2em 0.2em" }}>
          Sort by:
        </p>
        <ButtonGroup>
          <Button onClick={() => setSortMethod('population')} variant={sortMethod === 'population' ? "primary" : "secondary"}>Population</Button>
          <Button onClick={() => setSortMethod('area')} variant={sortMethod === 'area' ? "primary" : "secondary"}>Area</Button>
          <Button onClick={() => setSortMethod('name')} variant={sortMethod === 'name' ? "primary" : "secondary"}>Name</Button>
          <span style={{ marginLeft: '10px' }}>Total Population {"(" + countriesToShowFlagsFor.length + ") "}:
            {numberChanger(countriesToShowFlagsFor.map(x => x.population).reduce((a, b) => a + b, 0))}</span>
        </ButtonGroup>
      </div>

      {sortedList.map((x) =>
        <div key={x.name.common} className="selectedBox" style={{
          borderColor: getColor(x.cca2)
        }} >
          <p onClick={() => {
            setShowDetail(x.cca2.toLowerCase());
            window.scrollTo({ top: 95, behavior: 'smooth' });
          }}>
            {x.name.common + " " + x.flag} 
          </p>
        </div>
      )}
    </div >
  )
}

export default SelectedFlags
