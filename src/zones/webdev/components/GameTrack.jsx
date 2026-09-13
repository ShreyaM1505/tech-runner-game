import React from 'react'
import { Player } from './Player'
import { ObstacleItem } from './ObstacleItem'
import { VictoryPoint } from './VictoryPoint'

export function GameTrack({
  playerX,
  jumpY,
  isJumping,
  isLanding,
  isSliding,
  obstacles = [],
  coins = [],
  victoryPoint = null,
  isHit = false,
}) {
  return (
    <div className={`sidescroll-viewport ${isHit ? 'screen-glitch' : ''}`}>
      {/* Background Layer 1: Night Sky with Stars & Nebulae */}
      <div className="bg-sky-layer">
        <div className="stars-cluster"></div>
        {/* Faint speedometer curve from screenshot */}
        <div className="speedometer-arc"></div>
      </div>

      {/* Background Layer 2: Distant Mountain Silhouettes */}
      <div className="bg-mountains-layer">
        <div className="mountain mountain-1"></div>
        <div className="mountain mountain-2"></div>
        <div className="mountain mountain-3"></div>
      </div>

      {/* Background Layer 3: Neon City Skyline with Windows */}
      <div className="bg-city-layer">
        <div className="building b1">
          <div className="window-grid"></div>
        </div>
        <div className="building b2">
          <div className="window-grid"></div>
        </div>
        <div className="building b3">
          <div className="window-grid"></div>
        </div>
        <div className="building b4">
          <div className="window-grid"></div>
        </div>
        <div className="building b5">
          <div className="window-grid"></div>
        </div>
      </div>

      {/* Game Entities Layer: Coins / Tokens */}
      <div className="coins-layer">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className={`track-coin ${coin.collected ? 'coin-collected' : ''}`}
            style={{ left: `${coin.x}%`, bottom: `${coin.y}%` }}
          >
            <span className="coin-symbol">$</span>
            {coin.collected && <span className="coin-pickup-popup">+25</span>}
          </div>
        ))}
      </div>

      {/* Obstacles Layer */}
      <div className="obstacles-layer-2d">
        {obstacles.map((obstacle) => (
          <ObstacleItem key={obstacle.id} obstacle={obstacle} />
        ))}
      </div>

      {/* Victory Point / Finish Gate */}
      {victoryPoint && victoryPoint.active && (
        <VictoryPoint x={victoryPoint.x} />
      )}

      {/* 2D Player Character */}
      <Player
        x={playerX}
        jumpY={jumpY}
        isJumping={isJumping}
        isLanding={isLanding}
        isSliding={isSliding}
      />

      {/* Foreground Platform Ground Surface (Green Cap + Stone Base) */}
      <div className="platform-ground">
        <div className="ground-green-strip"></div>
        <div className="ground-stone-base">
          <div className="stone-tile-pattern"></div>
        </div>
      </div>
    </div>
  )
}
