import React, { useEffect, useRef, useState } from "react";
import '../styles/hoverer.css'
import { useCountry } from "../context/CountryContext";


const Map3 = () => {
  const { countries, mapColor, showDetail, clickOne, mode: appMode, mobileView } = useCountry();
  let svgRef = useRef(null);
  
  // Base fills per theme:
  // light mode => black land, brighter ocean
  // dark mode => softer grey land, darker ocean
  let landBaseColor = appMode ? "#000000" : "#8a8a8a"
  let oceanColor = appMode ? "#eef9ff" : "#6f7d88"
  
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    content: null, 
    x: 0, 
    y: 0 
  });

  const calcLocalTime = (timezoneStr) => {
    if (!timezoneStr) return "N/A";
    
    const match = timezoneStr.match(/UTC([+-]\d+)(:(\d+))?/);
    if (!match) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const hoursOffset = parseInt(match[1], 10);
    const minutesOffset = match[3] ? parseInt(match[3], 10) : 0;

    const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const offsetMs = (hoursOffset * 3600000) + (minutesOffset * 60000 * (hoursOffset < 0 ? -1 : 1));
    const localTime = new Date(utcTime + offsetMs);

    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getBestTimezone = (c) => {
    if (!c.timezones || c.timezones.length === 0) return null;
    if (c.timezones.length === 1) return c.timezones[0];
    
    if (c.capitalInfo && c.capitalInfo.latlng && c.capitalInfo.latlng.length > 1) {
      const lon = c.capitalInfo.latlng[1];
      const estimatedOffset = lon / 15;
      
      let bestTz = c.timezones[0];
      let minDiff = Infinity;
      
      c.timezones.forEach(tz => {
        const match = tz.match(/UTC([+-]\d+)(:(\d+))?/);
        if (match) {
          const hours = parseInt(match[1]);
          const minutes = match[3] ? parseInt(match[3]) : 0;
          const offset = hours + (minutes / 60) * (hours < 0 ? -1 : 1);
          
          const diff = Math.abs(estimatedOffset - offset);
          if (diff < minDiff) {
            minDiff = diff;
            bestTz = tz;
          }
        }
      });
      return bestTz;
    }
    return c.timezones[0];
  };

  const handleMouseEnter = (event, id) => {
    if (!countries) return;
    
    const country = countries.find(c => c.cca2.toLowerCase() === id.toLowerCase());
    
    if (country) {
      const capital = country.capital ? country.capital[0] : "N/A";
      const timezone = getBestTimezone(country);
      const time = calcLocalTime(timezone);

      setTooltip({
        visible: true,
        x: event.pageX,
        y: event.pageY,
        content: (
          <>
            <b>{country.name.common}</b>
            <div className="tooltip-row">Capital: {capital}</div>
            <div className="tooltip-row">Local Time: {time}</div>
          </>
        )
      });
    } else if (id.includes('ocean')) {
      const name = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setTooltip({
        visible: true,
        x: event.pageX,
        y: event.pageY,
        content: (
          <>
            <b>{name}</b>
          </>
        )
      });
    }
  };

  const handleMouseMove = (event) => {
    setTooltip(prev => ({
      ...prev,
      x: event.pageX,
      y: event.pageY
    }));
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const updateElements = () => {
    if (!svgRef.current) return;
    
    const elements = Array.from(svgRef.current.firstChild.children);
    elements.forEach(c => {
      c.onclick = (event) => { clickOne(c.id) };
      c.onmouseenter = (event) => handleMouseEnter(event, c.id);
      c.onmousemove = (event) => handleMouseMove(event);
      c.onmouseleave = handleMouseLeave;

      let myColorObj = mapColor.find(e => e.id === c.id);
      if (myColorObj) {
        c.style.fill = myColorObj.color;
      } else if (c.getAttribute('data-type') === 'ocean') {
        c.style.fill = oceanColor;
      } else {
        c.style.fill = landBaseColor;
      }

      // Highlight border if this country is being shown in details
      if (showDetail && c.id.toLowerCase() === showDetail.toLowerCase() && c.getAttribute('data-type') !== 'ocean') {
        c.style.stroke = "#FFD700"; // Gold color for highlight
        c.style.strokeWidth = "2";
        // Bring to front
        c.parentElement.appendChild(c);
      } else {
        c.style.stroke = "";
        c.style.strokeWidth = "";
      }
    });
  };

  const wrapperRef = useRef(null);

  useEffect(() => {
    updateElements();
  }, [mapColor, landBaseColor, oceanColor, countries, showDetail]);

  useEffect(() => {
    if (mobileView && wrapperRef.current) {
      const wrapper = wrapperRef.current;
      wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
    }
  }, [mobileView]);

  return (
    <div 
      ref={wrapperRef}
      style={{ 
        overflowX: mobileView ? 'auto' : 'hidden', 
        overflowY: 'hidden',
        width: '100%',
        WebkitOverflowScrolling: 'touch',
        marginBottom: '10px'
      }}
    >
      {tooltip.visible && (
        <div 
          className="map-tooltip" 
          style={{ 
            left: tooltip.x + 10, 
            top: tooltip.y + 10,
            position: 'absolute'
          }}
        >
          {tooltip.content}
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox="30.767 241.591 784.077 458.627"
        xmlns="http://www.w3.org/2000/svg"
        className="mapHover"
        style={{ 
          minWidth: mobileView ? '800px' : '100%',
          height: 'auto',
          display: 'block'
        }}
      >
        <g >


          {/* Ocean Paths */}
        <rect id="arctic-ocean" data-type="ocean" x="30.767" y="241.591" width="784.077" height="51" opacity="0.8">
          <title>Arctic Ocean</title>
        </rect>
        <rect id="southern-ocean" data-type="ocean" x="30.767" y="623" width="784.077" height="77" opacity="0.8">
          <title>Southern Ocean</title>
        </rect>
        <rect id="atlantic-ocean" data-type="ocean" x="270" y="292.591" width="195" height="330.409" opacity="0.8">
          <title>Atlantic Ocean</title>
        </rect>
        <rect id="pacific-ocean-west" data-type="ocean" x="30.767" y="292.591" width="239.233" height="330.409" opacity="0.8">
          <title>Pacific Ocean</title>
        </rect>
        <rect id="pacific-ocean-east" data-type="ocean" x="682" y="292.591" width="132.844" height="330.409" opacity="0.8">
          <title>Pacific Ocean</title>
        </rect>
        <rect id="indian-ocean" data-type="ocean" x="465" y="292.591" width="217" height="330.409" opacity="0.8">
          <title>Indian Ocean</title>
        </rect>

        {/* Compass */}
        <g transform="translate(80, 620) scale(0.6)" style={{ pointerEvents: 'none' }}>
          <circle cx="0" cy="0" r="45" fill="none" stroke={appMode ? "#333" : "#eee"} strokeWidth="1" opacity="0.3" />
          <circle cx="0" cy="0" r="40" fill="none" stroke={appMode ? "#333" : "#eee"} strokeWidth="2" opacity="0.5" />
          
          {/* Main points (N, E, S, W) */}
          <g fill={appMode ? "#222" : "#fff"}>
            <path d="M 0,-40 L 5,0 L 0,5 L -5,0 Z" fill="#e74c3c" /> {/* North (Red) */}
            <path d="M 0,40 L 5,0 L 0,-5 L -5,0 Z" /> {/* South */}
            <path d="M 40,0 L 0,5 L -5,0 L 0,-5 Z" /> {/* East */}
            <path d="M -40,0 L 0,5 L 5,0 L 0,-5 Z" /> {/* West */}
          </g>

          {/* Sub points (NE, SE, SW, NW) */}
          <g fill={appMode ? "#666" : "#aaa"}>
            <path d="M 28,-28 L 0,3 L -3,0 Z" />
            <path d="M 28,28 L -3,0 L 0,-3 Z" />
            <path d="M -28,28 L 0,-3 L 3,0 Z" />
            <path d="M -28,-28 L 3,0 L 0,3 Z" />
          </g>

          {/* Labels */}
          <g fontSize="12" fontWeight="bold" fontFamily="serif" textAnchor="middle" fill={appMode ? "#000" : "#fff"}>
            <text x="0" y="-45">N</text>
            <text x="0" y="55">S</text>
            <text x="50" y="5">E</text>
            <text x="-50" y="5">W</text>
            
            <g fontSize="8" opacity="0.7">
              <text x="32" y="-32">NE</text>
              <text x="32" y="42">SE</text>
              <text x="-32" y="42">SW</text>
              <text x="-32" y="-32">NW</text>
            </g>
          </g>
        </g>
      </svg>
    </div>
    )
    }
export default Map3
