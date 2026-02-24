import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { MdLayersClear } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { Dropdown } from 'react-bootstrap';
import Map3 from './components/Map3'
import CountriesDropdown from './components/Dropdown'
import BlocDropdown from './components/BlocDropdown'
import ReligionDropdown from './components/ReligionDropdown'
import CountryDetails from './components/CountryDetails'
import Filter from './components/Filter'
import { countriesService } from './services/countriesService'
import { relService } from './services/relService'
import { currencyService } from './services/currencyService'
import { getBlocsService } from './services/blocService'
import LoginForm from './components/LoginForm'
import SelectedFlags from './components/SelectedFlags'
import SaveBloc from './components/SaveBloc'
import Footer from './components/Footer'



import './styles/MapBottomButtons.css'
import './styles/SaveBloc.css'


const getNewColor = () => {
  const R = Math.round(Math.random() * 255).toString(16).padStart(2, '0')
  const G = Math.round(Math.random() * 255).toString(16).padStart(2, '0')
  const B = Math.round(Math.random() * 255).toString(16).padStart(2, '0')
  return `#${R}${G}${B}`
}

function App() {
  const [loggingIn, setLoggingIn] = useState(true)
  const [selected, setSelected] = useState([])
  const [mapColor, setMapColor] = useState([])
  const [countries, setCountries] = useState([])
  const [showDetail, setShowDetail] = useState(null)
  const [user, setUser] = useState(null)
  const [blocs, setBlocs] = useState([])
  const [religions, setReligions] = useState([])
  const [background, setBackground] = useState("yellow")
  const [mode, setMode] = useState(true)
  // const [currencies, setCurrencies] = useState([])


  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const useDarkMode = query.matches
    
    if (useDarkMode) {
      setMode(false)
      setBackground("black")
    } else {
      setMode(true)
      setBackground("white")
    }

    const handler = (e) => {
      if (e.matches) {
        setMode(false)
        setBackground("black")
      } else {
        setMode(true)
        setBackground("white")
      }
    }
    
    query.addEventListener('change', handler)
    return () => query.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const fetchCountries = async () => {
      await countriesService().then(res => {
        setCountries(res)
        //console.log("countries in fetching app",countries)
      })
    }
    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchReligions = async () => {
      await relService().then(res => {
        setReligions(res)

      })
    }
    fetchReligions()
  }, [])

  const updateBlocList = () => {
    if (user) {
      const fetchBlocs = async () => {
        await getBlocsService(`bearer ${user.token}`).then(res => {
          //console.log("got blocs: ",res)
          setBlocs(res)
        })
      }
      fetchBlocs()
    }
  }

  const selectOne = (id) => {
    //console.log("selectOne called for ",id)
    if (selected.includes(id)) {
      //give it a new color
      setMapColor([...mapColor.filter(c => c.id !== id), { id: id, color: getNewColor() }])
    } else {
      setSelected([...selected, id])
      setMapColor([...mapColor, { id: id, color: getNewColor() }])
    }
    setShowDetail(id)
  }
  const changeMode = () => {
    if (mode) {
      setMode(!mode)
      setBackground("black")

    } else {
      setMode(!mode)
      setBackground("white")
    }
  }

  const deselectOne = (id) => {
    if (showDetail === id) {
      setShowDetail(null)
    }
    setSelected(selected.filter(c => c !== id))
    setMapColor(mapColor.filter(c => c.id !== id))
  }

  const deselectKeepDetails = (id) => {
    setSelected(selected.filter(c => c !== id))
    setMapColor(mapColor.filter(c => c.id !== id))
  }

  const selectMany = (ids) => {
    let ourColor = getNewColor()
    let newColors = ids.map(c => { return { id: c, color: ourColor } })
    setSelected([...selected.filter(s => !ids.includes(s)), ...ids])
    setMapColor([...mapColor.filter(c => !ids.includes(c.id)), ...newColors])
    /* old implementation that preserves existing colors
    let newColors = []
    let newSelections = []
    ids.forEach(country=>{
      if(!selected.includes(country)){
        newSelections.push(country)
        newColors.push({id:country,color:ourColor})
      }
    }) 
    setSelected([...selected,...newSelections])
    set MapColor([...mapColor,...newColors])
    */
  }
  const selectSortedMany = (ids) => {
    //let ourColor = getNewColor()
    //let newColors = ids.map(c => { return { id: c, color: ourColor } })
    setSelected(ids)
    //setMapColor([...mapColor.filter(c => !ids.includes(c.id)), ...newColors])

  }

  const clickOne = (clickedId) => {
    if (selected.includes(clickedId)) {
      if (showDetail === clickedId) {
        setShowDetail(null)
        //console.log("showDetail:", showDetail)
      }
      setSelected(selected.filter(c => c !== clickedId))
      setMapColor(mapColor.filter(c => c.id !== clickedId))

    } else {
      setSelected([...selected, clickedId])
      setMapColor([...mapColor, { id: clickedId, color: getNewColor() }])
      //console.log("showing detail for ",clickedId)
      setShowDetail(clickedId)
    }
  }

  return (countries == undefined ? <div>Didn't fetch...<Button variant="success" href="/">Reload</Button></div> : (<div style={{ background: background }}>
    <div className="container" style={{ border: "2px solid cyan", borderRadius: "5px" }}>
      {<div hidden={loggingIn}><LoginForm user={user} setUser={setUser} setBlocs={setBlocs} /></div>}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        align: 'center'
      }}>
        <Filter countries={countries} showDetail={showDetail} setShowDetail={setShowDetail} selected={selected} setSelected={setSelected} dkd={deselectKeepDetails} />
        <CountriesDropdown countries={countries} setShowDetail={setShowDetail} blocs={blocs} selectOne={selectOne} selectMany={selectMany} user={user} />
        <BlocDropdown countries={countries} selectMany={selectMany} />
        <ReligionDropdown countries={countries} religions={religions} selectMany={selectMany} selectOne={selectOne} />
        <Button hidden variant="warning" onClick={() => setLoggingIn(!loggingIn)}>Login</Button>
        <Button variant={mode ? "dark" : "light"} onClick={() => changeMode()}>{mode ? "🌙" : "☀️"}</Button>
        <Button href={"https://palcsta.github.io"}>{"🏠"}</Button>
        <a href="https://github.com/palcsta/continents"><svg height="30" class="octicon octicon-mark-github color-text-white" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg></a>
        {/* this theme thing didn't impress me
        <Dropdown hidden>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            Theme
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setBackground(getNewColor)}>Random</Dropdown.Item>
            <Dropdown.Item onClick={() => setBackground("white")}>White</Dropdown.Item>
            <Dropdown.Item onClick={() => setBackground("yellow")}>Yellow</Dropdown.Item>
            <Dropdown.Item onClick={() => setBackground("black")}>Dark Mode 🌙</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>*/}
      </div>



      <CountryDetails countries={countries} religions={religions} showDetail={showDetail} mapColor={mapColor} selected={selected} selectOne={selectOne} dkd={deselectKeepDetails} mode={mode} />
      <Map3 mapColor={mapColor} mode={mode} clickOne={clickOne} />
      <div className="mapButtonGroup">
        <IconContext.Provider value={{ size: "1.25em", className: "saveButtonIcon" }}>
          <Button variant="warning" onClick={() => { setShowDetail(null); setSelected([]); setMapColor([]) }}><MdLayersClear />Clear map</Button>
          <SaveBloc selected={selected} user={user} updateBlocList={updateBlocList} />
        </IconContext.Provider>
      </div>
      <SelectedFlags countries={countries} selected={selected} mapColor={mapColor} setShowDetail={setShowDetail} />
      <Footer />
    </div>
  </div>))
}

export default App
