import React, { createContext, useState, useEffect, useContext } from 'react';
import { countriesService } from '../services/countriesService';
import { relService } from '../services/relService';
import { getBlocsService } from '../services/blocService';
import { getNewColor } from '../utils/formatters';

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [mapColor, setMapColor] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showDetail, setShowDetail] = useState(null);
  const [user, setUser] = useState(null);
  const [blocs, setBlocs] = useState([]);
  const [religions, setReligions] = useState([]);
  const [mode, setMode] = useState(true);
  const [background, setBackground] = useState("white");
  const [loggingIn, setLoggingIn] = useState(true);
  const [mobileView, setMobileView] = useState(false);

  // Initialize theme based on system preference
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (isDark) => {
      setMode(!isDark);
      setBackground(isDark ? "black" : "white");
    };

    updateTheme(query.matches);

    const handler = (e) => updateTheme(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [countriesData, religionsData] = await Promise.all([
          countriesService(),
          relService()
        ]);
        setCountries(Array.isArray(countriesData) ? countriesData : []);
        setReligions(Array.isArray(religionsData) ? religionsData : []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateBlocList = () => {
    if (user) {
      getBlocsService(`bearer ${user.token}`).then(res => setBlocs(res));
    }
  };

  const selectOne = (id) => {
    const lowerId = id.toLowerCase();
    if (selected.includes(lowerId)) {
      setMapColor([...mapColor.filter(c => c.id !== lowerId), { id: lowerId, color: getNewColor() }]);
    } else {
      setSelected([...selected, lowerId]);
      setMapColor([...mapColor, { id: lowerId, color: getNewColor() }]);
    }
    setShowDetail(lowerId);
  };

  const deselectOne = (id) => {
    const lowerId = id.toLowerCase();
    if (showDetail === lowerId) setShowDetail(null);
    setSelected(selected.filter(c => c !== lowerId));
    setMapColor(mapColor.filter(c => c.id !== lowerId));
  };

  const selectMany = (ids) => {
    const lowerIds = ids.map(id => id.toLowerCase());
    const ourColor = getNewColor();
    const newColors = lowerIds.map(id => ({ id, color: ourColor }));
    
    setSelected([...selected.filter(s => !lowerIds.includes(s)), ...lowerIds]);
    setMapColor([...mapColor.filter(c => !lowerIds.includes(c.id)), ...newColors]);
  };

  const clickOne = (clickedId) => {
    const lowerId = clickedId.toLowerCase();
    if (selected.includes(lowerId)) {
      if (showDetail === lowerId) setShowDetail(null);
      setSelected(selected.filter(c => c !== lowerId));
      setMapColor(mapColor.filter(c => c.id !== lowerId));
    } else {
      setSelected([...selected, lowerId]);
      setMapColor([...mapColor, { id: lowerId, color: getNewColor() }]);
      setShowDetail(lowerId);
    }
  };

  const changeMode = () => {
    const newMode = !mode;
    setMode(newMode);
    setBackground(newMode ? "white" : "black");
  };

  const toggleMobileView = () => {
    setMobileView(prev => !prev);
  };

  const clearMap = () => {
    setShowDetail(null);
    setSelected([]);
    setMapColor([]);
  };

  const value = {
    loading,
    countries,
    religions,
    selected,
    mapColor,
    showDetail,
    user,
    blocs,
    mode,
    background,
    loggingIn,
    mobileView,
    setUser,
    setLoggingIn,
    setShowDetail,
    setSelected,
    selectOne,
    deselectOne,
    selectMany,
    clickOne,
    changeMode,
    toggleMobileView,
    clearMap,
    updateBlocList
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryProvider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) throw new Error('useCountry must be used within a CountryProvider');
  return context;
};
