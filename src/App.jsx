import React, { useState, useEffect, useCallback } from 'react';
import FX3Menu from './components/FX3Menu';
import FX9Menu from './components/FX9Menu';
import './index.css';

// Exposure Options
const isoSteps = [160, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];
const fstopSteps = [1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22];
const ndStepsFX3 = [0]; // FX3 has no internal ND 
const ndStepsFX9 = [0, 2, 4, 6]; // Clear, 1/4 (2 stops), 1/16 (4 stops), 1/64 (6 stops)
const tempSteps = [3200, 4300, 5600, 6500];

function calculateMeter(exposure) {
  // Base scenario for 0 EV meter: ISO 800, F4.0, ND 0
  const baselogIso = Math.log2(800);
  const logIso = Math.log2(exposure.iso);
  const isoDiff = logIso - baselogIso;

  const baseAperture = 4.0;
  // EV difference for aperture is 2 * log2(base/current)
  const apDiff = 2 * Math.log2(baseAperture / exposure.aperture);

  const ndDiff = -exposure.nd; // ND 2 is -2 stops
  
  const total = isoDiff + apDiff + ndDiff;
  return Math.max(-3, Math.min(3, total)); // Clamp between -3 and +3
}

const Histogram = ({ meterValue }) => {
  // Meter is bounded from -3 to +3
  // Translate this into an X offset shift
  const shift = meterValue * 25; 
  
  // A realistic looking multi-peak distribution curve 
  // By shifting its X coordinates, we simulate shadow/highlight clipping
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
        {/* Background box */}
        <rect width="120" height="60" fill="rgba(0,0,0,0.4)" />
        
        {/* Histogram Curve */}
        <path d={pathData} fill="rgba(255, 255, 255, 0.8)" />
        
        {/* Vertical Grid lines dividing zones */}
        <line x1="30" y1="0" x2="30" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <line x1="60" y1="0" x2="60" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <line x1="90" y1="0" x2="90" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      </svg>
    </div>
  );
};

const LightMeter = ({ meterValue }) => {
  // visual meter from -2 to +2
  const maxPixels = 60; // Max offset from center
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

const OSDOverlay = ({ activeCamera, exposure, activeOSDIndex }) => {
  const formatND = (stops) => {
    if (stops === 0) return 'Clear';
    if (stops === 2) return '1/4';
    if (stops === 4) return '1/16';
    if (stops === 6) return '1/64';
    return stops;
  };

  const meterVal = calculateMeter(exposure);

  // activeOSDIndex: 0 = Aperture, 1 = ND, 2 = ISO, 3 = Temp
  return (
    <div className={`osd-overlay ${activeCamera === 'FX9' ? 'fx9-osd' : 'fx3-osd'}`}>
      <div className="osd-top">
        <div className="osd-item">
          <span className="rec-indicator" style={{color: activeCamera === 'FX9' ? '#0f0' : '#f00'}}>
             {activeCamera === 'FX9' ? '•REC' : '•STBY'}
          </span>
          <span>00:00:00:00</span>
          <span style={{color: '#aaa', fontSize: '0.8rem'}}>TC</span>
        </div>
        <div className="osd-item">
          <span>{activeCamera === 'FX9' ? 'DC IN 14.4V' : 'BAT 92%'}</span>
        </div>
      </div>
      
      {/* Light meter in the center bottom */}
      <div className="meter-container">
        <LightMeter meterValue={meterVal} />
      </div>

      <Histogram meterValue={meterVal} />

      <div className="osd-bottom">
        <div className="osd-item">
          <span>{activeCamera === 'FX9' ? 'S-Log3' : 'S-Cinetone'}</span>
          <span>4K 24p</span>
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
  const [activeCamera, setActiveCamera] = useState(null); // 'FX3' | 'FX9' | null
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Shared Exposure State
  const [exposure, setExposure] = useState({
    iso: 800,
    aperture: 4.0,
    nd: 0,
    temp: 5600
  });

  // 0: Aperture, 1: ND, 2: ISO, 3: Temp
  const [activeOSDIndex, setActiveOSDIndex] = useState(0);

  // Global Menu values (to pass into FX components)
  const [globalValues, setGlobalValues] = useState({});

  useEffect(() => {
    // Sync exposure state to global menu values so the menu sees it!
    setGlobalValues(prev => ({
      ...prev,
      'ISO': typeof exposure.iso === 'string' ? exposure.iso : exposure.iso.toString(),
      'White Balance': typeof exposure.temp === 'string' ? exposure.temp : exposure.temp.toString(),
      // Adding explicit keys the menu might target
    }));
  }, [exposure]);

  const handleGlobalKey = useCallback((e) => {
    if ((e.key === 'm' || e.key === 'M') && activeCamera) {
      setMenuOpen(prev => !prev);
      return;
    }

    if (activeCamera && !menuOpen) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      // Max index is 3. If FX3, skip ND (index 1)
      const maxIdx = 3;
      
      if (e.key === 'ArrowLeft') {
        let next = activeOSDIndex - 1;
        if (activeCamera === 'FX3' && next === 1) next = 0; // skip ND
        if (next >= 0) setActiveOSDIndex(next);
      } else if (e.key === 'ArrowRight') {
        let next = activeOSDIndex + 1;
        if (activeCamera === 'FX3' && next === 1) next = 2; // skip ND
        if (next <= maxIdx) setActiveOSDIndex(next);
      } else if (e.key === 'ArrowUp') {
        setExposure(prev => {
          const nextExp = { ...prev };
          if (activeOSDIndex === 0) { // Aperture
            const i = fstopSteps.indexOf(prev.aperture);
            if (i > 0) nextExp.aperture = fstopSteps[i - 1]; // Up means opening aperture (lower number)
          } else if (activeOSDIndex === 1 && activeCamera === 'FX9') { // ND
            const i = ndStepsFX9.indexOf(prev.nd);
            if (i < ndStepsFX9.length - 1) nextExp.nd = ndStepsFX9[i + 1]; // Up means more ND
          } else if (activeOSDIndex === 2) { // ISO
            const i = isoSteps.indexOf(prev.iso);
            if (i < isoSteps.length - 1) nextExp.iso = isoSteps[i + 1];
          } else if (activeOSDIndex === 3) { // Temp
            const i = tempSteps.indexOf(prev.temp);
            if (i < tempSteps.length - 1) nextExp.temp = tempSteps[i + 1];
          }
          return nextExp;
        });
      } else if (e.key === 'ArrowDown') {
        setExposure(prev => {
          const nextExp = { ...prev };
          if (activeOSDIndex === 0) { // Aperture
            const i = fstopSteps.indexOf(prev.aperture);
            if (i < fstopSteps.length - 1) nextExp.aperture = fstopSteps[i + 1]; // Down means stopping down (higher number)
          } else if (activeOSDIndex === 1 && activeCamera === 'FX9') { // ND
            const i = ndStepsFX9.indexOf(prev.nd);
            if (i > 0) nextExp.nd = ndStepsFX9[i - 1]; // Down means less ND
          } else if (activeOSDIndex === 2) { // ISO
            const i = isoSteps.indexOf(prev.iso);
            if (i > 0) nextExp.iso = isoSteps[i - 1];
          } else if (activeOSDIndex === 3) { // Temp
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
      {/* OSD Overlay */}
      {activeCamera && (
        <OSDOverlay 
          activeCamera={activeCamera} 
          exposure={exposure} 
          activeOSDIndex={!menuOpen ? activeOSDIndex : -1} 
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
            <FX3Menu onClose={() => setMenuOpen(false)} globalValues={globalValues} setGlobalValues={setGlobalValues} />
          )}
          {menuOpen && activeCamera === 'FX9' && (
            <FX9Menu onClose={() => setMenuOpen(false)} globalValues={globalValues} setGlobalValues={setGlobalValues} />
          )}
        </>
      )}

      {/* Global Instructions Overlay */}
      <div className="instructions">
        {activeCamera === null ? (
          <>Select a camera to start</>
        ) : menuOpen ? (
          <>Menu: <kbd>M</kbd> &nbsp;|&nbsp; Navigate: <kbd>Arrows</kbd> &nbsp;|&nbsp; Select: <kbd>Enter / Right</kbd> &nbsp;|&nbsp; Back: <kbd>Esc / Left</kbd></>
        ) : (
          <>OSD Edit: <kbd>Arrows</kbd> &nbsp;|&nbsp; Open Menu: <kbd>M</kbd> &nbsp;|&nbsp; Return: <kbd>Refresh</kbd></>
        )}
      </div>

    </div>
  );
}

export default App;
