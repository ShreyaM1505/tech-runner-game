import React from 'react'

export function HUD({
  score,
  distance,
  targetDistance,
  coinsCount = 0,
  lives = 4,
  isPaused = false,
  onTogglePause,
}) {
  const progressPercent = Math.min(100, Math.round((distance / targetDistance) * 100))

  return (
    <div className="reference-hud">
      {/* Top Left: Player Profile, Hearts, Score & Coins */}
      <div className="hud-card hud-profile-card">
        <div className="profile-avatar-box">
          <svg className="avatar-silhouette" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div className="profile-meta">
          <div className="hearts-row">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className={`heart-icon ${i < lives ? 'heart-full' : 'heart-empty'}`}
              >
                ♥
              </span>
            ))}
          </div>
          <div className="score-and-coins">
            <div className="hud-score-text">
              <span className="label">SCORE:</span>
              <span className="value">{score}</span>
            </div>
            <div className="hud-coins-text">
              <span className="coin-dot">$</span>
              <span className="coin-count">{coinsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Center: Zone Title Card (Matching Screenshot) */}
      <div className="hud-card hud-title-card">
        <div className="zone-icon-circle">
          <span className="zone-symbol">{'</>'}</span>
        </div>
        <div className="zone-title-content">
          <h1 className="zone-main-title">ZONE 2 — WEB DEVELOPMENT</h1>
          <p className="zone-sub-title">Explore the world of Web Development</p>
          <div className="zone-meta-tags">
            <span className="meta-tag">EASY</span>
            <span className="meta-dot">•</span>
            <span className="meta-tag">{progressPercent === 0 ? 'START' : 'RUNNING'}</span>
            <span className="meta-dot">•</span>
            <span className="meta-tag progress-tag">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Top Right: Pause Card */}
      <button
        type="button"
        className="hud-card hud-pause-card"
        onClick={onTogglePause}
        title={isPaused ? 'Resume Game' : 'Pause Game'}
        aria-label="Pause"
      >
        {isPaused ? '▶' : '❚❚'}
      </button>
    </div>
  )
}
