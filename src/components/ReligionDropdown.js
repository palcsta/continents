import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import '../styles/MapBottomButtons.css'

const ReligionDropdown = ({ countries, religions, selectMany, selectOne }) => {
  if (!religions || religions.length === 0) return null

  const uniqueReligions = [...new Set(religions.map(r => r.religion))].filter(Boolean).sort()

  const nameToCca2 = {}
  countries.forEach(c => {
    if (c.name && c.name.common) {
      nameToCca2[c.name.common.toLowerCase()] = c.cca2.toLowerCase()
    }
    if (c.name && c.name.official) {
      nameToCca2[c.name.official.toLowerCase()] = c.cca2.toLowerCase()
    }
  })

  return (
    <DropdownButton id="religion-dropdown-button" title="Religions">
      {uniqueReligions.map(religion => {
        const matchingCountries = religions
          .filter(r => r.religion === religion)
          .map(r => {
            const cca2 = nameToCca2[r.country.toLowerCase()]
            return cca2 ? { name: r.country, cca2 } : null
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name))

        if (matchingCountries.length === 0) return null

        return (
          <div key={religion} style={{ display: "inline block" }}>
            <div align="center" className="panel-footer " split="true">
              <Dropdown as={"ButtonGroup"}>
                <div style={{ display: "flex", margin: "5%" }}>
                  <Button 
                    onClick={() => selectMany(matchingCountries.map(c => c.cca2))}
                    variant="info"
                  >
                    {religion}
                  </Button>
                  <Dropdown.Toggle split="true" variant="success" id={`dropdown-${religion}`} />
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

export default ReligionDropdown
