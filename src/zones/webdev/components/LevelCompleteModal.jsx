import React from 'react'

export function LevelCompleteModal({
  score,
  distance,
  dodgedCount,
  coinsCount = 0,
  obstaclesHit = 0,
  completionRecord,
  onRestart,
  onNextDomain,
}) {
  const displayPlayerId = completionRecord?.playerId || 'DEV-RUNNER'
  const displayScore = completionRecord?.score ?? score
  const displayCoins = completionRecord?.coins ?? coinsCount
  const displayAvoided = completionRecord?.obstaclesAvoided ?? dodgedCount
  const displayHit = completionRecord?.obstaclesHit ?? obstaclesHit
  const displayTime = completionRecord?.completionTime || '00:00.0'

  return (
    <div className="zone-overlay">
      <div className="zone-modal modal-success">
        <div className="modal-header-row">
          <div className="modal-badge">BUILD SUCCESSFUL</div>
          <div className="player-id-badge">
            <span className="player-icon">👤</span>
            <span className="player-label">ID:</span>
            <span className="player-value">{displayPlayerId}</span>
          </div>
        </div>

        <h2 className="modal-title">Web Dev Zone Cleared!</h2>
        <p className="modal-subtitle">
          All client-side and server-side obstacles bypassed. Completion record saved.
        </p>

        {/* 6 Core Completion Record Metric Cards */}
        <div className="modal-stats modal-stats-grid">
          <div className="stat-card">
            <span className="stat-num">{displayScore}</span>
            <span className="stat-name">Final Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-num coin-stat">{displayCoins}</span>
            <span className="stat-name">Coins</span>
          </div>
          <div className="stat-card">
            <span className="stat-num avoided-stat">{displayAvoided}</span>
            <span className="stat-name">Obstacles Avoided</span>
          </div>
          <div className="stat-card">
            <span className="stat-num hit-stat">{displayHit}</span>
            <span className="stat-name">Obstacles Hit</span>
          </div>
          <div className="stat-card">
            <span className="stat-num time-stat">{displayTime}</span>
            <span className="stat-name">Completion Time</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{distance}m</span>
            <span className="stat-name">Distance</span>
          </div>
        </div>

        {/* Storage Persistence Confirmation */}
        <div className="record-status-pill">
          <span className="status-indicator-dot"></span>
          <span>Web Dev Completion Record Saved</span>
          {completionRecord?.id && (
            <code className="record-ref-id">#{completionRecord.id.slice(-6)}</code>
          )}
        </div>

        <div className="modal-actions">
          <button className="zone-btn btn-secondary" onClick={onRestart}>
            Replay Zone
          </button>
          {onNextDomain && (
            <button className="zone-btn btn-primary" onClick={onNextDomain}>
              Next Domain →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

