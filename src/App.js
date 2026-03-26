import React from 'react'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { MdLayersClear } from 'react-icons/md'
import { IconContext } from 'react-icons'
import Map3 from './components/Map3'
import CountriesDropdown from './components/Dropdown'
import TimezoneDropdown from './components/TimezoneDropdown'
import BlocDropdown from './components/BlocDropdown'
import ReligionDropdown from './components/ReligionDropdown'
import LanguageDropdown from './components/LanguageDropdown'
import CountryDetails from './components/CountryDetails'
import Filter from './components/Filter'
import LoginForm from './components/LoginForm'
import SelectedFlags from './components/SelectedFlags'
import SaveBloc from './components/SaveBloc'
import Footer from './components/Footer'
import { useCountry } from './context/CountryContext'

import './styles/MapBottomButtons.css';

const App = () => {
  const {
    loading,
    countries,
    mode,
    background,
    loggingIn,
    setLoggingIn,
    changeMode,
    toggleMobileView,
    mobileView,
    clearMap
  } = useCountry();

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: background,
        color: mode ? 'black' : 'white'
      }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: '10px' }}>Loading geographical data...</p>
      </div>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20%', background: background, height: '100vh' }}>
        <p>Didn't fetch any data...</p>
        <Button variant="success" onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  return (
    <div style={{ background: background, minHeight: '100vh', transition: 'background 0.3s ease' }}>
      <div className="container" style={{ border: "2px solid cyan", borderRadius: "5px", padding: '15px' }}>
        <div hidden={loggingIn}>
          <LoginForm />
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          margin: '10px 0'
        }}>
          <TimezoneDropdown />
          <Filter />
          <CountriesDropdown />
          <BlocDropdown />
          <ReligionDropdown />
          <LanguageDropdown />
          <Button hidden variant="warning" onClick={() => setLoggingIn(!loggingIn)}>Login</Button>
          <Button variant={mode ? "dark" : "light"} onClick={changeMode}>
            {mode ? "🌙" : "☀️"}
          </Button>
          <Button variant="info" onClick={toggleMobileView}>
            {mobileView ? "🖥️ Desktop" : "📱 Mobile"}
          </Button>
          <Button href="https://palcsta.github.io">🏠</Button>
          <a href="https://github.com/palcsta/continents" target="_blank" rel="noopener noreferrer">
            <svg height="32" style={{ fill: mode ? "black" : "white" }} viewBox="0 0 16 16" width="32">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
        </div>

        <CountryDetails />
        <Map3 />
        
        <div className="mapButtonGroup">
          <IconContext.Provider value={{ size: "1.25em", className: "saveButtonIcon" }}>
            <Button variant="warning" onClick={clearMap}>
              <MdLayersClear /> Clear map
            </Button>
            <SaveBloc />
          </IconContext.Provider>
        </div>
        
        <SelectedFlags />
        <Footer />
      </div>
    </div>
  );
};

export default App;
