import React from 'react'

export function LevelCompleteModal({ score, distance, dodgedCount, onRestart, onNextDomain }) {
  return (
    <div className="zone-overlay">
      <div className="zone-modal modal-success">
        <div className="modal-badge">BUILD SUCCESSFUL</div>
        <h2 className="modal-title">Web Dev Zone Cleared!</h2>
        <p className="modal-subtitle">
          All client-side and server-side obstacles have been bypassed. Production ready!
        </p>

        <div className="modal-stats">
          <div className="stat-card">
            <span className="stat-num">{score}</span>
            <span className="stat-name">Final Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{distance}m</span>
            <span className="stat-name">Distance Cleared</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{dodgedCount}</span>
            <span className="stat-name">Bugs Dodged</span>
          </div>
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
