import React from 'react';

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import '../styles/MapBottomButtons.css'

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

const getA2 = (country) => {
  return country.cca2.toLowerCase()
}

const CountriesDropdown = (props) => {
  
  const continents = props.countries.filter(x => x.region !== "Polar").map(x => x.region).filter(unique)

  return (
    <>
      {/*<div align="center" className="panel-footer " split="true" className="mapTopButton">*/}
        <DropdownButton id="dropdown-basic-button" title="Browse" split="true">
          {continents.filter(x => x !== "").map(x =>
            <div style={{ display: "inline block" }}>
              <div key={x} align="center" className="panel-footer " split="true">
                <Dropdown as={"ButtonGroup"}>
                  <Button onClick={() => {
                    let matchingRegion = props.countries.filter(r => r.region === x)
                    //console.log("selecting ",matchingRegion)
                    let selection = []
                    matchingRegion.forEach(match => selection.push(getA2(match)))
                    //console.log("selecting alphacodes ",selection)
                    props.selectMany(selection)
                  }} variant="info" >{x}</Button>
                  <Dropdown.Toggle split="true" variant="success" id="dropdown-custom-2" />
                  <Dropdown.Menu className="super-colors" >

                    {props.countries.filter(y => y.region.includes(x)).map(x => x.subregion)
                      .filter(unique).map(z =>
                        <div class=" " style={{ display: "inline block" }}>

                          <Dropdown key={z} as={"ButtonGroup"}>
                            <div style={{ display: "flex" ,margin:"5%"}}>
                              <Button onClick={() => {
                                let matchingSubregion = props.countries.filter(g => g.subregion === z)
                                //console.log("selecting ", matchingSubregion)
                                let selection = []
                                matchingSubregion.forEach(match => selection.push(getA2(match)))
                                //console.log("WHAT GIVING SETMANY ",selection)
                                //console.log("selecting alphacodes ",selection)
                                props.selectMany(selection)
                              }} variant="info">{"   " + z}
                              </Button>
                              <Dropdown.Toggle split="true" variant="success" id="dropdown-custom-2" />
                              <Dropdown.Menu className="super-colors">
                                {props.countries.filter(a => a.subregion === z).map(b =>
                                  <div style={{ display: "inline block" }}>
                                    <Dropdown.Item
                                      key={b.name}
                                      onClick={() => {
                                        let matchingCountry = props.countries.find(q => q.name.common === b.name.common)
                                        //console.log("selecting one country?",matchingCountry)
                                        let selection = getA2(matchingCountry)
                                        //console.log("selecting alphacode ",selection)
                                        props.selectOne(selection)
                                      }
                                      }>
                                      {b.name.common}
                                    </Dropdown.Item></div>)}
                              </Dropdown.Menu>
                            </div>
                          </Dropdown>
                          <Dropdown.Divider />
                        </div>
                      )}

                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <Dropdown.Divider />
            </div>
          )}
        
        </DropdownButton>
{/*      </div>*/}

    </>
  )
}

export default CountriesDropdown
