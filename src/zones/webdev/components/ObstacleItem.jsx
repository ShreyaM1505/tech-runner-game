import React from 'react'

export function ObstacleItem({ obstacle }) {
  const { type, config, x } = obstacle

  // Render dedicated visual graphics for each of the 6 obstacles
  const renderObstacleGraphic = () => {
    switch (type) {
      case 'API_ERROR':
        return (
          <div className="obs-graphic obs-api-error">
            {/* Red electric spikes emerging from ground */}
            <div className="spikes-container">
              <div className="spike spike-1"></div>
              <div className="spike spike-2"></div>
              <div className="spike spike-3"></div>
              <div className="spike spike-4"></div>
            </div>
            <div className="obs-badge ground-badge">
              <span className="badge-icon">⚡</span>
              <span className="badge-title">500 API ERROR</span>
              <span className="badge-action-hint">▲ JUMP</span>
            </div>
          </div>
        )

      case 'DATABASE_TIMEOUT':
        return (
          <div className="obs-graphic obs-db-timeout">
            {/* Bubbling cyan database pool */}
            <div className="db-puddle-surface">
              <div className="db-canister can-1">
                <div className="db-ring"></div>
                <div className="db-ring"></div>
              </div>
              <div className="db-canister can-2">
                <div className="db-ring"></div>
                <div className="db-ring"></div>
              </div>
              <div className="bubble b-1"></div>
              <div className="bubble b-2"></div>
            </div>
            <div className="obs-badge ground-badge db-badge">
              <span className="badge-icon">🗄️</span>
              <span className="badge-title">504 DB TIMEOUT</span>
              <span className="badge-action-hint">▲ JUMP</span>
            </div>
          </div>
        )

      case 'SLOW_PAGE':
        return (
          <div className="obs-graphic obs-slow-page">
            {/* Overhead heavy loading barrier */}
            <div className="overhead-hanger">
              <div className="hanger-cable cable-left"></div>
              <div className="hanger-cable cable-right"></div>
            </div>
            <div className="slow-page-banner">
              <div className="spinner-gear"></div>
              <div className="slow-page-text">
                <span className="banner-title">SLOW PAGE LOAD</span>
                <span className="banner-sub">99% LAG (9999ms)</span>
              </div>
            </div>
            {/* Visible clearance tunnel below */}
            <div className="clearance-indicator">
              <span className="clearance-arrow">▼ SLIDE UNDER ▼</span>
            </div>
          </div>
        )

      case 'BROKEN_LAYOUT':
        return (
          <div className="obs-graphic obs-broken-layout">
            {/* Distorted overlapping CSS glitch boxes overhead */}
            <div className="overhead-hanger">
              <div className="hanger-cable cable-left"></div>
              <div className="hanger-cable cable-right"></div>
            </div>
            <div className="broken-layout-box">
              <div className="css-wireframe wireframe-1">
                <code>{'<div flex-wrap: broken>'}</code>
              </div>
              <div className="css-wireframe wireframe-2">
                <code>{'overflow: clip !important'}</code>
              </div>
            </div>
            {/* Visible clearance tunnel below */}
            <div className="clearance-indicator purple-clearance">
              <span className="clearance-arrow">▼ SLIDE UNDER ▼</span>
            </div>
          </div>
        )

      case 'BROKEN_LINK':
        return (
          <div className="obs-graphic obs-broken-link">
            {/* Severed chain & 404 card */}
            <div className="broken-link-card">
              <div className="severed-chain">
                <span className="chain-link">⛓️</span>
                <span className="crack-symbol">⚡</span>
                <span className="chain-link">🔗</span>
              </div>
              <div className="link-text">
                <span className="link-title">404 NOT FOUND</span>
                <span className="link-sub">BROKEN LINK</span>
              </div>
            </div>
            {/* Visual Danger Zone laser and Safe Zone Arrow */}
            <div className="dodge-lane-telegraph telegraph-left">
              <span className="safe-arrow">◀ DODGE LEFT</span>
            </div>
          </div>
        )

      case 'CORS_WALL':
        return (
          <div className="obs-graphic obs-cors-wall">
            {/* Towering neon-magenta firewall security grid */}
            <div className="cors-firewall-shield">
              <div className="firewall-grid"></div>
              <div className="firewall-header">
                <span className="shield-icon">🛡️</span>
                <span className="firewall-title">CORS BLOCKED</span>
              </div>
              <span className="firewall-sub">ORIGIN ACCESS DENIED</span>
            </div>
            {/* Visual Safe Zone Arrow pointing right */}
            <div className="dodge-lane-telegraph telegraph-right">
              <span className="safe-arrow">DODGE RIGHT ▶</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Calculate vertical alignment
  const isOverhead = config.placement === 'OVERHEAD'
  const isGround = config.placement === 'GROUND'

  return (
    <div
      className={`obstacle-item-2d obstacle-${type.toLowerCase()} placement-${config.placement.toLowerCase()}`}
      style={{
        left: `${x}%`,
        bottom: isOverhead ? 'calc(13% + 48px)' : '13%',
        width: `${config.widthPx}px`,
        height: `${config.heightPx}px`,
      }}
    >
      {renderObstacleGraphic()}
    </div>
  )
}
