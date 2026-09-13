import React from 'react'

/**
 * VictoryPoint Component
 * Represents the Finish / Victory Line at the end of the Web Development track
 * Becomes visible and approaches the player after 45 seconds of gameplay.
 *
 * @param {Object} props
 * @param {number} props.x - Horizontal position along the track (%)
 */
export function VictoryPoint({ x }) {
  return (
    <div
      className="victory-point-entity"
      style={{ left: `${x}%` }}
      aria-label="Victory / Finish Point"
    >
      {/* Overhead Cyber Finish Arch */}
      <div className="victory-arch-frame">
        <div className="arch-pylon pylon-left">
          <div className="pylon-beacon"></div>
        </div>

        <div className="arch-crossbar">
          <div className="victory-holo-sign">
            <div className="holo-flag">🏁</div>
            <div className="holo-text">
              <span className="holo-title">VICTORY POINT</span>
              <span className="holo-sub">PROD DEPLOYMENT</span>
            </div>
            <div className="holo-icon">🚀</div>
          </div>
          <div className="energy-streamer"></div>
        </div>

        <div className="arch-pylon pylon-right">
          <div className="pylon-beacon"></div>
        </div>
      </div>

      {/* Vertical Energy Gate Beams */}
      <div className="victory-gate-field"></div>

      {/* Ground Finish Line Checkered Strip */}
      <div className="victory-ground-strip">
        <div className="checkered-pattern"></div>
      </div>
    </div>
  )
}
