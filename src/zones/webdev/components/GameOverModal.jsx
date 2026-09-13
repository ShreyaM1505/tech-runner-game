import React from 'react'

export function GameOverModal({ score, distance, obstacle, onRestart }) {
  return (
    <div className="zone-overlay">
      <div className="zone-modal modal-danger">
        <div className="modal-badge danger-badge">UNCAUGHT RUNTIME EXCEPTION</div>
        <h2 className="modal-title">Crash Detected!</h2>

        {obstacle && (
          <div className="collision-detail">
            <span className="collision-icon">{obstacle.icon}</span>
            <div className="collision-text">
              <strong>Hit Obstacle:</strong> {obstacle.label}
              <div className="collision-remedy">
                Required action was: <code>{obstacle.description}</code>
              </div>
            </div>
          </div>
        )}

        <div className="modal-stats">
          <div className="stat-card">
            <span className="stat-num">{score}</span>
            <span className="stat-name">Final Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{distance}m</span>
            <span className="stat-name">Distance Reached</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="zone-btn btn-primary danger-btn" onClick={onRestart}>
            Debug & Retry ↻
          </button>
        </div>
      </div>
    </div>
  )
}
