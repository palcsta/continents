import React from 'react'

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import '../styles/MapBottomButtons.css'

const blocGroups = [
  {
    id: 'eu',
    label: 'EU members',
    countries: [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE',
      'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT',
      'RO', 'SK', 'SI', 'ES', 'SE'
    ]
  },
  {
    id: 'nato',
    label: 'NATO members',
    countries: [
      'AL', 'BE', 'BG', 'CA', 'HR', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE',
      'GR', 'HU', 'IS', 'IT', 'LV', 'LT', 'LU', 'ME', 'NL', 'MK', 'NO',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'TR', 'GB', 'US'
    ]
  }
]

const BlocDropdown = ({ countries, selectMany }) => {
  const countryLookup = new Set(countries.map(country => country.cca2.toLowerCase()))

  const toSelectableList = (codes) => (
    codes
      .map(code => code.toLowerCase())
      .filter(code => countryLookup.has(code))
  )

  return (
    <DropdownButton id="bloc-dropdown-button" title="Blocs">
      {blocGroups.map(bloc => (
        <Dropdown.Item
          key={bloc.id}
          onClick={() => selectMany(toSelectableList(bloc.countries))}
        >
          {bloc.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

export default BlocDropdown
