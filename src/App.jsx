import React, { useState } from 'react'
import { WebDevZone } from './zones/webdev'
import './App.css'

function App() {
  const [lastEvent, setLastEvent] = useState(null)

  const handleZoneComplete = (record) => {
    console.log('[Tech Runner] Web Dev Zone Completed & Stored Record:', record)
    setLastEvent({ type: 'COMPLETED', record })
  }

  const handleGameOver = (stats) => {
    console.log('[Tech Runner] Game Over in Web Dev Zone:', stats)
    setLastEvent({ type: 'GAME_OVER', stats })
  }

  return (
    <div className="app-shell">
      {/* Top Navigation / Multi-Domain Shell Header */}
      <header className="shell-header">
        <div className="shell-brand">
          <span className="shell-title">TECH RUNNER</span>
          <span className="shell-badge">DEVELOPMENT BUILD</span>
        </div>
        <div className="domain-navigation">
          <div className="domain-pill disabled" title="Reserved for domain integration">
            Domain 1 (Pending)
          </div>
          <div className="domain-pill active">
            <span className="status-dot"></span> Zone 2: Web Dev
          </div>
          <div className="domain-pill disabled" title="Reserved for domain integration">
            Domain 3 (Pending)
          </div>
          <div className="domain-pill disabled" title="Reserved for domain integration">
            Domain 4 (Pending)
          </div>
        </div>
      </header>

      {/* Main Game Viewport housing the WebDevZone */}
      <main className="shell-main">
        <WebDevZone
          onZoneComplete={handleZoneComplete}
          onGameOver={handleGameOver}
        />
      </main>
    </div>
  )
}

export default App
