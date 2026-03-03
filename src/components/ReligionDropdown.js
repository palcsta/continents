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

  const christianSubgroups = [
    {
      name: "Catholicism",
      countries: ["Vatican City", "Italy", "Spain", "France", "Poland", "Ireland", "Portugal", "Mexico", "Brazil", "Argentina", "Colombia", "Philippines", "Austria", "Belgium", "Croatia", "Lithuania", "Slovakia", "Slovenia", "Luxembourg", "Monaco", "Malta", "San Marino", "Andorra", "Liechtenstein", "Peru", "Venezuela", "Chile", "Ecuador", "Guatemala", "Bolivia", "Cuba", "Dominican Republic", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay"]
    },
    {
      name: "Protestantism",
      countries: ["United Kingdom", "United States", "Germany", "Nigeria", "South Africa", "Sweden", "Norway", "Denmark", "Finland", "Iceland", "Switzerland", "Netherlands", "Australia", "New Zealand", "Canada", "Kenya", "Ghana", "Uganda", "Malawi", "Zambia", "Zimbabwe", "Namibia", "Botswana", "Rwanda", "Burundi", "Bahamas", "Barbados", "Jamaica", "Guyana", "Suriname", "Papua New Guinea", "Fiji", "Samoa", "Tonga", "Vanuatu", "Solomon Islands"]
    },
    {
      name: "Orthodoxy",
      countries: ["Greece", "Russia", "Ukraine", "Romania", "Bulgaria", "Serbia", "Georgia", "Cyprus", "Ethiopia", "Eritrea", "Belarus", "Moldova", "Montenegro", "North Macedonia", "Armenia"]
    }
  ]

  return (
    <DropdownButton id="religion-dropdown-button" title="Religions" split="true">
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
                    {religion === "Christianity" && <Dropdown.Header>Subgroups</Dropdown.Header>}
                    {religion === "Christianity" && christianSubgroups.map(sub => {
                      const subCountries = sub.countries
                        .map(name => {
                          const cca2 = nameToCca2[name.toLowerCase()]
                          return cca2 ? { name, cca2 } : null
                        })
                        .filter(Boolean)

                      if (subCountries.length === 0) return null

                      return (
                        <div key={sub.name} style={{ display: "inline block" }}>
                          <Dropdown as={"ButtonGroup"}>
                            <div style={{ display: "flex", margin: "5%" }}>
                              <Button 
                                onClick={() => selectMany(subCountries.map(c => c.cca2))}
                                variant="info"
                              >
                                {"   " + sub.name}
                              </Button>
                              <Dropdown.Toggle split="true" variant="success" id={`dropdown-${sub.name}`} />
                              <Dropdown.Menu className="super-colors">
                                {subCountries.map(country => (
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
                      )
                    })}
                    {religion === "Christianity" && <Dropdown.Divider />}
                    {religion === "Christianity" && <Dropdown.Header>Other Christian Countries</Dropdown.Header>}
                    {matchingCountries
                      .filter(c => {
                        if (religion !== "Christianity") return true
                        return !christianSubgroups.some(sub => sub.countries.some(sc => sc.toLowerCase() === c.name.toLowerCase()))
                      })
                      .map(country => (
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
