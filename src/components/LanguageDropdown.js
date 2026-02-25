import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import '../styles/MapBottomButtons.css'

const LanguageDropdown = ({ countries, selectMany, selectOne }) => {
  if (!countries || countries.length === 0) return null

  // Map to store language name -> { countries: [country objects], totalPopulation: number }
  const languageMap = {}

  countries.forEach(country => {
    if (country.languages) {
      Object.values(country.languages).forEach(lang => {
        if (!languageMap[lang]) {
          languageMap[lang] = {
            countries: [],
            totalPopulation: 0
          }
        }
        languageMap[lang].countries.push({
          name: country.name.common,
          cca2: country.cca2.toLowerCase()
        })
        languageMap[lang].totalPopulation += (country.population || 0)
      })
    }
  })

  // Filter languages spoken in 2 or more countries
  const multiCountryLanguages = Object.keys(languageMap)
    .filter(lang => languageMap[lang].countries.length >= 2)
    .sort((a, b) => {
      // Primary sort: number of countries (descending)
      const countDiff = languageMap[b].countries.length - languageMap[a].countries.length
      if (countDiff !== 0) return countDiff
      
      // Secondary sort: total population (descending)
      return languageMap[b].totalPopulation - languageMap[a].totalPopulation
    })

  return (
    <DropdownButton id="language-dropdown-button" title="Languages">
      {multiCountryLanguages.map(lang => {
        const matchingCountries = languageMap[lang].countries.sort((a, b) => a.name.localeCompare(b.name))

        return (
          <div key={lang} style={{ display: "inline block" }}>
            <div align="center" className="panel-footer " split="true">
              <Dropdown as={"ButtonGroup"}>
                <div style={{ display: "flex", margin: "5%" }}>
                  <Button 
                    onClick={() => selectMany(matchingCountries.map(c => c.cca2))}
                    variant="info"
                  >
                    {lang}
                  </Button>
                  <Dropdown.Toggle split="true" variant="success" id={`dropdown-${lang}`} />
                  <Dropdown.Menu className="super-colors">
                    {matchingCountries.map(country => (
                      <Dropdown.Item
                        key={country.cca2}
                        onClick={() => selectOne(country.cca2)}
                      >
                        {country.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </div>
              </Dropdown>
            </div>
            <Dropdown.Divider />
          </div>
        )
      })}
    </DropdownButton>
  )
}

export default LanguageDropdown
