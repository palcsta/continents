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
  },
  {
    id: 'brics',
    label: 'BRICS',
    countries: ['BR', 'RU', 'IN', 'CN', 'ZA']
  },
  {
    id: 'asean',
    label: 'ASEAN',
    countries: ['BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN']
  },
  {
    id: 'mercosur',
    label: 'MERCOSUR',
    countries: ['AR', 'BR', 'PY', 'UY']
  },
  {
    id: 'g7',
    label: 'G7',
    countries: ['CA', 'FR', 'DE', 'IT', 'JP', 'GB', 'US']
  },
  {
    id: 'arab-league',
    label: 'Arab League',
    countries: ['DZ', 'BH', 'KM', 'DJ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MR', 'MA', 'OM', 'PS', 'QA', 'SA', 'SO', 'SD', 'SY', 'TN', 'AE', 'YE']
  },
  {
    id: 'african-union',
    label: 'African Union',
    countries: [
      'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW', 'EH'
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
