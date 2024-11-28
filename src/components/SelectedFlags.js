import React from 'react'
import { useState } from 'react'
import '../styles/SelectedFlags.css'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
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




const SelectedFlags = (props) => {
  
  let countriesToShowFlagsFor = props.countries.filter(x => props.selected.includes(x.cca2.toLowerCase()))
  const [show, setShow] = useState(countriesToShowFlagsFor)
  const getColor = (a2) => {
    let myColorObj = props.mapColor.find(z => z.id.toUpperCase() === a2)
    return myColorObj ? myColorObj.color : "red"
  }


  let list =
    countriesToShowFlagsFor
      .sort((a, b) => parseFloat(b.population) - parseFloat(a.population
      ))





  return (

    <div>



      { show !== undefined && countriesToShowFlagsFor.length !== 0 ? <div style={{ "textAlign": "right","margin":"0.2em" }}>
        <p style={{"display":"inline","margin":"0.2em 0.5em 0.2em 0.2em"}}>
        Sort by:
        </p>
      <ButtonGroup>
          <Button onClick={() => setShow(
            countriesToShowFlagsFor
              .sort((a, b) => parseFloat(b.population) - parseFloat(a.population)))}
            variant="secondary">Population</Button>
          <Button onClick={() => setShow(
            countriesToShowFlagsFor
              .sort((a, b) => parseFloat(b.area) - parseFloat(a.area)))} variant="secondary">Area</Button>
          <Button variant="secondary" onClick={() =>
            setShow(countriesToShowFlagsFor
              .sort(function (a, b) {
                if (a.name.common < b.name.common) { return -1; }
                if (a.name.common > b.name.common) { return 1; }
                return 0;
              })
            )}>Name</Button>
	<>Population of {"("+countriesToShowFlagsFor.length+") "}:
	{numberChanger(countriesToShowFlagsFor.map(x => x.population).reduce((a, b) => a + b))}</>
        </ButtonGroup>
      </div> : ""}


      {show.length > 0 && show.length == countriesToShowFlagsFor.length ? show.map((x, i) =>
        <div key={x.name.common} className="selectedBox" style={{
          borderColor: getColor(x.cca2)
        }} ><p onClick={() => (props.setShowDetail(x.cca2.toLowerCase()), window.scrollTo({
          top: 95,
          behavior: 'smooth',
        }))}>
            {x.name.common}<img className="selectedFlag" src={x.flags[0]} alt={x.name.common}></img>
          </p>
        </div>
      ) :
        list.map((x, i) =>
          <div key={x.name.common} className="selectedBox" style={{
            borderColor: getColor(x.cca2)
              , textAlign: 'center'
              
          }} ><p onClick={() => (props.setShowDetail(x.cca2.toLowerCase()), window.scrollTo({
            top: 95,
            behavior: 'smooth',
          }))}>
              {x.flag+""+x.name.common}{/*<img className="selectedFlag" src={x.flags[0]} alt={""}></img>*/}
            </p>
          </div>
        )}

    </div >

  )

}

export default SelectedFlags
