import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import '../styles/MapBottomButtons.css'

const TimezoneDropdown = ({ countries, selectMany, selectOne }) => {
  if (!countries || countries.length === 0) return null

  // Map to store timezone -> list of country objects
  const timezoneMap = {}

  countries.forEach(country => {
    if (country.timezones && country.timezones.length > 0) {
      // Use the first timezone as the primary grouping
      const tz = country.timezones[0]
      if (!timezoneMap[tz]) {
        timezoneMap[tz] = []
      }
      timezoneMap[tz].push({
        name: country.name.common,
        cca2: country.cca2.toLowerCase()
      })
    }
  })

  // Sort timezones logic (UTC-12:00 to UTC+14:00)
  const sortedTimezones = Object.keys(timezoneMap).sort((a, b) => {
    const getOffset = (str) => {
      const match = str.match(/UTC([+-]\d+)(:(\d+))?/)
      if (!match) return 0
      const hours = parseInt(match[1])
      const minutes = match[3] ? parseInt(match[3]) : 0
      return hours + (minutes / 60) * (hours < 0 ? -1 : 1)
    }
    return getOffset(a) - getOffset(b)
  })

  return (
    <DropdownButton id="timezone-dropdown-button" title="Timezones" variant="primary">
      {sortedTimezones.map(tz => {
        const matchingCountries = timezoneMap[tz].sort((a, b) => a.name.localeCompare(b.name))

        return (
          <div key={tz} style={{ display: "inline block" }}>
            <div align="center" className="panel-footer " split="true">
              <Dropdown as={"ButtonGroup"}>
                <div style={{ display: "flex", margin: "5%" }}>
                  <Button 
                    onClick={() => selectMany(matchingCountries.map(c => c.cca2))}
                    variant="info"
                  >
                    {tz}
                  </Button>
                  <Dropdown.Toggle split="true" variant="success" id={`dropdown-${tz}`} />
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

export default TimezoneDropdown
