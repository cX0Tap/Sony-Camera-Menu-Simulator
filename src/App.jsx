import React, { useState, useEffect, useCallback } from 'react';
import FX3Menu from './components/FX3Menu';
import FX9Menu from './components/FX9Menu';
import './index.css';

// Exposure Options
const isoSteps = [160, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];
const fstopSteps = [1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22];
const ndStepsFX3 = [0]; 
const ndStepsFX9 = [0, 2, 4, 6]; 
const tempSteps = [3200, 4300, 5600, 6500];

function calculateMeter(exposure) {
  const baselogIso = Math.log2(800);
  const logIso = Math.log2(exposure.iso);
  const isoDiff = logIso - baselogIso;

  const baseAperture = 4.0;
  const apDiff = 2 * Math.log2(baseAperture / exposure.aperture);

  const ndDiff = -exposure.nd; 
  
  const total = isoDiff + apDiff + ndDiff;
  return Math.max(-3, Math.min(3, total));
}

const CameraFeed = ({ exposure, showPhoto }) => {
  const meterVal = calculateMeter(exposure);
  const brightnessFactor = Math.min(Math.pow(2, meterVal), 8);
  
  const getTempTint = (temp) => {
     if (temp === 3200) return 'rgba(0, 100, 255, 0.25)'; 
     if (temp === 4300) return 'rgba(0, 100, 255, 0.10)';
     if (temp === 5600) return 'transparent'; 
     if (temp === 6500) return 'rgba(255, 150, 0, 0.15)'; 
     return 'transparent';
  };

  return (
    <div className="live-camera-feed" style={{
      backgroundColor: '#111',
      backgroundImage: showPhoto ? `url('https://images.unsplash.com/photo-1590422749909-1baee86326e0?q=80&w=2000&auto=format&fit=crop')` : 'none',
      filter: `brightness(${brightnessFactor})`
    }}>
      <div className="wb-tint" style={{ backgroundColor: getTempTint(exposure.temp) }}></div>
    </div>
  );
};

const Histogram = ({ meterValue }) => {
  const shift = meterValue * 25; 
  
  const pathData = `
    M -100 60 
    C -60 60, -40 20, ${10 + shift} 30 
    S ${30 + shift} 50, ${50 + shift} 15 
    S ${70 + shift} 40, ${90 + shift} 25 
    S ${130 + shift} 60, 220 60
    Z
  `;

  return (
    <div className="histogram-container">
      <svg width="120" height="60" viewBox="0 0 120 60">
        <rect width="120" height="60" fill="rgba(0,0,0,0.4)" />
        <path d={pathData} fill="rgba(255, 255, 255, 0.8)" />
        <line x1="30" y1="0" x2="30" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <line x1="60" y1="0" x2="60" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <line x1="90" y1="0" x2="90" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      </svg>
    </div>
  );
};

const LightMeter = ({ meterValue }) => {
  const maxPixels = 60; 
  const offset = (meterValue / 2) * maxPixels; 
  const displayVal = meterValue > 0 ? `+${meterValue.toFixed(1)}` : meterValue.toFixed(1);

  return (
    <div className="light-meter">
      <div className="meter-scale">
        <span>-2</span>
        <div className="tick default"></div>
        <span>-1</span>
        <div className="tick default"></div>
        <span>0</span>
        <div className="tick default"></div>
        <span>+1</span>
        <div className="tick default"></div>
        <span>+2</span>
        
        <div 
          className="meter-needle" 
          style={{ transform: `calc(translateX(-50%) + translateX(${Math.max(-80, Math.min(80, offset))}px))` }}
        />
      </div>
      <div className="meter-value">{displayVal} MM</div>
    </div>
  );
};

// MARKER RENDERING LOGIC
const MarkerOverlay = ({ values, activeCamera }) => {
  let isMasterOn = false;
  if (activeCamera === 'FX3') {
    isMasterOn = values['Marker Display'] === 'On';
  } else {
    // FX9 relies strictly on the individual toggle values if Master doesn't exist, we fallback to true
    isMasterOn = true; 
  }
  
  if (!isMasterOn) return null;

  return (
    <div className="marker-overlay">
      {/* 1. Guideframe (Rule of Thirds Grid) */}
      {values['Guideframe'] === 'On' && (
        <>
          <div className="marker-guide v-left"></div>
          <div className="marker-guide v-right"></div>
          <div className="marker-guide h-top"></div>
          <div className="marker-guide h-bottom"></div>
        </>
      )}

      {/* 2. Safety Zone */}
      {values['Safety Zone'] === '80%' && <div className="marker-safety s-80"></div>}
      {values['Safety Zone'] === '90%' && <div className="marker-safety s-90"></div>}

      {/* 3. Aspect Marker */}
      {(values['Aspect Marker'] && values['Aspect Marker'] !== 'Off') && (
        <div className={`marker-aspect a-${values['Aspect Marker'].replace(':', '').replace('.', '')}`}></div>
      )}

      {/* 4. Center Marker */}
      {values['Center Marker'] === 'On' && (
        <div className="marker-center">
          <div className="mc-horiz"></div>
          <div className="mc-vert"></div>
        </div>
      )}
    </div>
  );
};

const OSDOverlay = ({ activeCamera, exposure, activeOSDIndex, globalValues }) => {
  const formatND = (stops) => {
    if (stops === 0) return 'Clear';
    if (stops === 2) return '1/4';
    if (stops === 4) return '1/16';
    if (stops === 6) return '1/64';
    return stops;
  };

  const meterVal = calculateMeter(exposure);

  return (
    <div className={`osd-overlay ${activeCamera === 'FX9' ? 'fx9-osd' : 'fx3-osd'}`}>
      <MarkerOverlay values={globalValues} activeCamera={activeCamera} />

      <div className="osd-top">
        <div className="osd-item">
          <span className="rec-indicator" style={{color: activeCamera === 'FX9' ? '#0f0' : '#f00'}}>
             {activeCamera === 'FX9' ? '•REC' : '•STBY'}
          </span>
          <span>{globalValues['Time Code Format'] === 'NDF' ? '00:00:00:00' : '00:00:00;00'}</span>
          <span style={{color: '#aaa', fontSize: '0.8rem'}}>TC</span>
        </div>
        <div className="osd-item">
          <span>{activeCamera === 'FX9' ? 'DC IN 14.4V' : 'BAT 92%'}</span>
        </div>
      </div>
      
      <div className="meter-container">
        <LightMeter meterValue={meterVal} />
      </div>

      <Histogram meterValue={meterVal} />

      <div className="osd-bottom">
        <div className="osd-item">
          <span>{activeCamera === 'FX9' ? 'S-Log3' : 'S-Cinetone'}</span>
          <span>4K {globalValues['Rec Frame Rate'] || '24p'}</span>
        </div>
        <div className="osd-item osd-editable-group">
          <span className={`osd-val ${activeOSDIndex === 0 ? 'osd-active' : ''}`}>F{exposure.aperture.toFixed(1)}</span>
          {activeCamera === 'FX9' && (
            <span className={`osd-val ${activeOSDIndex === 1 ? 'osd-active' : ''}`}>
              <span style={{color: '#aaa', fontSize: '0.9rem'}}>ND</span> {formatND(exposure.nd)}
            </span>
          )}
          <span className={`osd-val ${activeOSDIndex === 2 ? 'osd-active' : ''}`}>ISO {exposure.iso}</span>
          <span className={`osd-val ${activeOSDIndex === 3 ? 'osd-active' : ''}`}>{exposure.temp}K</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeCamera, setActiveCamera] = useState(null); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPhoto, setShowPhoto] = useState(true);
  
  const [exposure, setExposure] = useState({
    iso: 800,
    aperture: 4.0,
    nd: 0,
    temp: 5600
  });

  const [activeOSDIndex, setActiveOSDIndex] = useState(0);

  // Global Menu values (used by both Menu logic and OSD Overlay markers)
  const [globalValues, setGlobalValues] = useState({
    'Marker Display': 'On',
    'Center Marker': 'On',
    'Aspect Marker': '2.35:1',
    'Safety Zone': 'Off',
    'Guideframe': 'On',
    'Rec Frame Rate': '24p',
    'Time Code Format': 'DF'
  });

  // Sync exposure state to global menu values so the menu sees it!
  useEffect(() => {
    setGlobalValues(prev => ({
      ...prev,
      'ISO': typeof exposure.iso === 'string' ? exposure.iso : exposure.iso.toString(),
      'White Balance': typeof exposure.temp === 'string' ? exposure.temp : exposure.temp.toString()
    }));
  }, [exposure]);

  const handleGlobalKey = useCallback((e) => {
    if (e.key === 'o' || e.key === 'O') {
      setShowPhoto(prev => !prev);
    }

    if ((e.key === 'm' || e.key === 'M') && activeCamera) {
      setMenuOpen(prev => !prev);
      return;
    }

    if (activeCamera && !menuOpen) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      const maxIdx = 3;
      
      if (e.key === 'ArrowLeft') {
        let next = activeOSDIndex - 1;
        if (activeCamera === 'FX3' && next === 1) next = 0; 
        if (next >= 0) setActiveOSDIndex(next);
      } else if (e.key === 'ArrowRight') {
        let next = activeOSDIndex + 1;
        if (activeCamera === 'FX3' && next === 1) next = 2; 
        if (next <= maxIdx) setActiveOSDIndex(next);
      } else if (e.key === 'ArrowUp') {
        setExposure(prev => {
          const nextExp = { ...prev };
          if (activeOSDIndex === 0) { 
            const i = fstopSteps.indexOf(prev.aperture);
            if (i > 0) nextExp.aperture = fstopSteps[i - 1]; 
          } else if (activeOSDIndex === 1 && activeCamera === 'FX9') { 
            const i = ndStepsFX9.indexOf(prev.nd);
            if (i < ndStepsFX9.length - 1) nextExp.nd = ndStepsFX9[i + 1]; 
          } else if (activeOSDIndex === 2) { 
            const i = isoSteps.indexOf(prev.iso);
            if (i < isoSteps.length - 1) nextExp.iso = isoSteps[i + 1];
          } else if (activeOSDIndex === 3) { 
            const i = tempSteps.indexOf(prev.temp);
            if (i < tempSteps.length - 1) nextExp.temp = tempSteps[i + 1];
          }
          return nextExp;
        });
      } else if (e.key === 'ArrowDown') {
        setExposure(prev => {
          const nextExp = { ...prev };
          if (activeOSDIndex === 0) { 
            const i = fstopSteps.indexOf(prev.aperture);
            if (i < fstopSteps.length - 1) nextExp.aperture = fstopSteps[i + 1]; 
          } else if (activeOSDIndex === 1 && activeCamera === 'FX9') { 
            const i = ndStepsFX9.indexOf(prev.nd);
            if (i > 0) nextExp.nd = ndStepsFX9[i - 1]; 
          } else if (activeOSDIndex === 2) { 
            const i = isoSteps.indexOf(prev.iso);
            if (i > 0) nextExp.iso = isoSteps[i - 1];
          } else if (activeOSDIndex === 3) { 
            const i = tempSteps.indexOf(prev.temp);
            if (i > 0) nextExp.temp = tempSteps[i - 1];
          }
          return nextExp;
        });
      }
    }
  }, [activeCamera, menuOpen, activeOSDIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [handleGlobalKey]);

  return (
    <div className="simulator-container">
      {/* Live Video Feed Background */}
      {activeCamera !== null ? (
        <CameraFeed exposure={exposure} showPhoto={showPhoto} />
      ) : (
        <div className="live-camera-feed default-feed"></div>
      )}

      {/* OSD Overlay */}
      {activeCamera && (
        <OSDOverlay 
          activeCamera={activeCamera} 
          exposure={exposure} 
          activeOSDIndex={!menuOpen ? activeOSDIndex : -1} 
          globalValues={globalValues}
        />
      )}

      {/* Main UI */}
      {activeCamera === null ? (
        <div className="camera-selector">
          <h2>Select Camera Simulator</h2>
          <div className="camera-options">
            <button 
              className={`cam-btn`}
              onClick={() => { setActiveCamera('FX9'); }}
            >
              Sony FX9
            </button>
            <button 
              className={`cam-btn`}
              onClick={() => { setActiveCamera('FX3'); }}
            >
              Sony FX3
            </button>
          </div>
          <p style={{marginTop: '20px', color: '#aaa', fontSize: '0.9rem'}}>
            Use Arrows to adjust exposure live. Press <kbd>M</kbd> to open menu.
          </p>
        </div>
      ) : (
        <>
          {menuOpen && activeCamera === 'FX3' && (
            <FX3Menu onClose={() => setMenuOpen(false)} values={globalValues} setValues={setGlobalValues} />
          )}
          {menuOpen && activeCamera === 'FX9' && (
            <FX9Menu onClose={() => setMenuOpen(false)} values={globalValues} setValues={setGlobalValues} />
          )}
        </>
      )}

      <div className="instructions">
        {activeCamera === null ? (
          <>Select a camera to start</>
        ) : menuOpen ? (
          <>Menu: <kbd>M</kbd> &nbsp;|&nbsp; Navigate: <kbd>Arrows</kbd> &nbsp;|&nbsp; Select: <kbd>Enter / Right</kbd> &nbsp;|&nbsp; Back: <kbd>Esc / Left</kbd></>
        ) : (
          <>Edit: <kbd>Arrows</kbd> &nbsp;|&nbsp; Menu: <kbd>M</kbd> &nbsp;|&nbsp; Photo: <kbd>O</kbd> &nbsp;|&nbsp; Return: <kbd>Refresh</kbd></>
        )}
      </div>

    </div>
  );
}

export default App;
