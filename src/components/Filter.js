import '../styles/MapBottomButtons.css'
import { render } from '@testing-library/react';
import React, { useState } from 'react';

const Filter = (props) => {

  const [searchBoxContent, setSearchBoxContent] = useState("")
  const [searchHints,setSearchHints] = useState("")
 
  const handleNewSearchBoxContent = (event) => {
    // console.log("event ", event)

    let filtered = props.countries.filter(
      x =>
/*		  x.name.common.toLowerCase()===
          event.target.value.toLowerCase()
          ||*/ (x.name.common.toLowerCase().includes(
          event.target.value.toLowerCase()) || (x.name.common.toLowerCase()==event.target.value.toLowerCase()))
          )
    event.preventDefault()
//    console.log("event trgt vlue",event.traget.value)
    setSearchBoxContent(event.target.value)
    //console.log("FILTERED: ", filtered)
    if (filtered) {
      //console.log("filtered", filtered.length)
      if (filtered.length === 1) {
        //console.log("searchbox wants to show details for ", filtered[0].cca2.toLowerCase()) //alpha to lower
        props.setShowDetail(filtered[0].cca2.toLowerCase())
      }
      if (filtered.length < 21 && filtered.length !== 1) {
      	if(filtered.map(x => x.name.common.toLowerCase()).includes(
      	event.target.value.toLowerCase())){
		let alpha = 
		filtered.filter(x => x.name.common.toLowerCase()==
      	event.target.value.toLowerCase())[0].cca2
	//console.log(alpha)
     	props.setShowDetail(alpha.toLowerCase())
      	}
        setSearchHints(filtered.map(x => x.name.common).join(", "))
      } else {
        setSearchHints("")
      }
    }
    !event.target.value && props.setShowDetail(null)
  }

  return (
    <>
      {/*<div style={{ "textAlign": "center" }} className="mapTopButton">*/}
        <input placeholder="Search for a country" value={searchBoxContent}
          onChange={handleNewSearchBoxContent} />
        {searchHints && <span>Did you mean: </span>}{searchHints}
      {/*</div>*/}
    </>
  )
}
export default Filter
