import React from 'react'
import { useWebDevGame } from './hooks/useWebDevGame'
import { useControls } from './hooks/useControls'
import { GameTrack } from './components/GameTrack'
import { HUD } from './components/HUD'
import { LevelCompleteModal } from './components/LevelCompleteModal'
import { GameOverModal } from './components/GameOverModal'
import './styles/webdev.css'

/**
 * WebDevZone Component
 * Modular zone component for Tech Runner: Web Development Domain (2D Side-Scroller)
 *
 * @param {Object} props
 * @param {Function} [props.onZoneComplete] - Callback fired upon level completion
 * @param {Function} [props.onGameOver] - Callback fired on collision / game over
 * @param {Function} [props.onScoreChange] - Real-time score update callback
 * @param {number} [props.targetDistance=1000] - Distance in meters required to complete zone
 * @param {boolean} [props.autoStart=false] - If true, starts runner immediately
 */
export function WebDevZone({
  onZoneComplete,
  onGameOver,
  onScoreChange,
  targetDistance = 1000,
  autoStart = false,
}) {
  const {
    status,
    playerX,
    jumpY,
    isJumping,
    isLanding,
    isSliding,
    distance,
    score,
    coinsCount,
    lives,
    dodgedCount,
    obstacles,
    coins,
    lastCollisionObstacle,
    isInvulnerable,
    startGame,
    togglePause,
    triggerJump,
    triggerSlide,
    setMoveLeft,
    setMoveRight,
  } = useWebDevGame({
    onZoneComplete,
    onGameOver,
    onScoreChange,
    targetDistance,
    autoStart,
  })

  // Keyboard controls listener
  useControls({
    onMoveLeftStart: () => setMoveLeft(true),
    onMoveLeftEnd: () => setMoveLeft(false),
    onMoveRightStart: () => setMoveRight(true),
    onMoveRightEnd: () => setMoveRight(false),
    onJump: triggerJump,
    onSlide: triggerSlide,
    isEnabled: status === 'PLAYING',
  })

  return (
    <div className={`webdev-zone-container ${isInvulnerable ? 'player-invulnerable' : ''}`}>
      {/* Top HUD Matching User Screenshot */}
      <HUD
        score={score}
        distance={distance}
        targetDistance={targetDistance}
        coinsCount={coinsCount}
        lives={lives}
        isPaused={status === 'PAUSED'}
        onTogglePause={togglePause}
      />

      {/* 2D Side-Scrolling Interactive Game Track */}
      <GameTrack
        playerX={playerX}
        jumpY={jumpY}
        isJumping={isJumping}
        isLanding={isLanding}
        isSliding={isSliding}
        obstacles={obstacles}
        coins={coins}
        isHit={status === 'GAME_OVER'}
      />

      {/* Bottom Controls Replicating the User's Screenshot */}
      <div className="game-onscreen-controls">
        {/* Bottom Left: Circular Directional Controls */}
        <div className="bottom-left-controls">
          <button
            type="button"
            className="circle-ctrl-btn btn-left"
            onMouseDown={() => setMoveLeft(true)}
            onMouseUp={() => setMoveLeft(false)}
            onMouseLeave={() => setMoveLeft(false)}
            onTouchStart={() => setMoveLeft(true)}
            onTouchEnd={() => setMoveLeft(false)}
            disabled={status !== 'PLAYING'}
            aria-label="Run Left"
          >
            ◀
          </button>
          <button
            type="button"
            className="circle-ctrl-btn btn-right"
            onMouseDown={() => setMoveRight(true)}
            onMouseUp={() => setMoveRight(false)}
            onMouseLeave={() => setMoveRight(false)}
            onTouchStart={() => setMoveRight(true)}
            onTouchEnd={() => setMoveRight(false)}
            disabled={status !== 'PLAYING'}
            aria-label="Run Right"
          >
            ▶
          </button>
        </div>

        {/* Bottom Right: Rounded JUMP and SLIDE Action Buttons */}
        <div className="bottom-right-controls">
          <button
            type="button"
            className="action-pill-btn btn-jump"
            onClick={triggerJump}
            disabled={status !== 'PLAYING'}
            aria-label="Jump"
          >
            JUMP
          </button>
          <button
            type="button"
            className="action-pill-btn btn-slide"
            onClick={triggerSlide}
            disabled={status !== 'PLAYING'}
            aria-label="Slide"
          >
            SLIDE
          </button>
        </div>
      </div>

      {/* Start Overlay if IDLE */}
      {status === 'IDLE' && (
        <div className="zone-overlay">
          <div className="zone-modal modal-start">
            <div className="modal-badge">ZONE 2: WEB DEVELOPMENT</div>
            <h2 className="modal-title">Ready to Run?</h2>
            <p className="modal-subtitle">
              Run from left to right along the platform. Dodge all 6 web development obstacles:
            </p>
            <div className="start-obstacle-grid">
              <div className="start-obstacle-chip"><span>⚡💥 API Error</span> → JUMP</div>
              <div className="start-obstacle-chip"><span>🗄️⏱️ DB Timeout</span> → JUMP</div>
              <div className="start-obstacle-chip"><span>⏳🐌 Slow Page</span> → SLIDE</div>
              <div className="start-obstacle-chip"><span>📐⚠️ Broken Layout</span> → SLIDE</div>
              <div className="start-obstacle-chip"><span>🔗❌ Broken Link</span> → DODGE LEFT ◀</div>
              <div className="start-obstacle-chip"><span>🛡️🚫 CORS Wall</span> → DODGE RIGHT ▶</div>
            </div>
            <button className="zone-btn btn-primary" onClick={startGame}>
              Start Zone Run 🚀
            </button>
          </div>
        </div>
      )}

      {/* Pause Overlay if PAUSED */}
      {status === 'PAUSED' && (
        <div className="zone-overlay">
          <div className="zone-modal modal-pause">
            <div className="modal-badge">GAME PAUSED</div>
            <h2 className="modal-title">Zone 2 on Hold</h2>
            <p className="modal-subtitle">Take a breather or resume your run.</p>
            <button className="zone-btn btn-primary" onClick={togglePause}>
              Resume Run ▶
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal on collision */}
      {status === 'GAME_OVER' && (
        <GameOverModal
          score={score}
          distance={distance}
          obstacle={lastCollisionObstacle}
          onRestart={startGame}
        />
      )}

      {/* Level Complete Modal */}
      {status === 'COMPLETED' && (
        <LevelCompleteModal
          score={score}
          distance={distance}
          dodgedCount={dodgedCount}
          onRestart={startGame}
          onNextDomain={() => onZoneComplete?.({ score, distance, dodgedCount, coinsCount })}
        />
      )}
    </div>
  )
}

export default WebDevZone
