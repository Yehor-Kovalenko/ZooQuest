const MapPanel = () => {
  return (
    <div id="map-panel">
      <p className="lede">Tap a stop once you've been there, or switch on location and let nearby stops stamp themselves. GPS works best when this page is opened directly in your phone's browser rather than inside a preview window.</p>

      <div className="gps-card">
        <div className="gps-row">
          <strong>Auto-stamp with location</strong>
          <label className="switch">
            <input type="checkbox" id="gps-toggle" />
            <span className="track"></span>
          </label>
        </div>
        <div className="gps-status" id="gps-status"></div>
      </div>

      <div className="progress-row">
        <strong>Your route</strong>
        <span id="progress-text">0 / 0 stamped</span>
      </div>
      <div className="progress-bar"><div className="progress-fill" id="progress-fill"></div></div>

      <div className="trail-wrap">
        <svg className="trail" viewBox="0 0 100 140" id="trail-svg">
          <path className="trail-path" id="trail-path" d=""></path>
          <g id="trail-nodes"></g>
        </svg>
      </div>

      <div id="zone-list"></div>

      <button className="reset-link" id="reset-btn">Reset all stamps</button>
      <p className="footlinks">Plan ahead: <a href="https://orientarium.lodz.pl/en/opening-hours/" target="_blank" rel="noopener">opening hours</a> · <a href="https://orientarium.lodz.pl/en/tickets/" target="_blank" rel="noopener">tickets</a> · <a href="https://orientarium.lodz.pl/en/access/" target="_blank" rel="noopener">getting there</a></p>
    </div>
  )
};

export default MapPanel;