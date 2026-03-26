import '../styles/MapBottomButtons.css'
import React, { useState } from 'react';
import { useCountry } from '../context/CountryContext';

const Filter = () => {
  const { countries, setShowDetail } = useCountry();
  const [searchBoxContent, setSearchBoxContent] = useState("")
  const [searchHints, setSearchHints] = useState("")
 
  const handleNewSearchBoxContent = (event) => {
    const value = event.target.value;
    setSearchBoxContent(value);

    if (!value) {
      setShowDetail(null);
      setSearchHints("");
      return;
    }

    const filtered = countries.filter(x => 
      x.name.common.toLowerCase().includes(value.toLowerCase())
    );

    if (filtered.length === 1) {
      setShowDetail(filtered[0].cca2.toLowerCase());
    } else if (filtered.length > 1 && filtered.length < 21) {
      const exactMatch = filtered.find(x => x.name.common.toLowerCase() === value.toLowerCase());
      if (exactMatch) {
        setShowDetail(exactMatch.cca2.toLowerCase());
      }
      setSearchHints(filtered.map(x => x.name.common).join(", "));
    } else {
      setSearchHints("");
    }
  }

  return (
    <>
      <input 
        placeholder="Search for a country" 
        value={searchBoxContent}
        onChange={handleNewSearchBoxContent} 
      />
      {searchHints && <span>Did you mean: </span>}{searchHints}
    </>
  )
}

export default Filter
