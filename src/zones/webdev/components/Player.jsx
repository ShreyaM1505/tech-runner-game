import React from 'react'

export function Player({ x, jumpY, isSliding, isJumping, isLanding }) {
  const playerClasses = [
    'man-player',
    isJumping ? 'is-jumping' : '',
    isLanding ? 'is-landing' : '',
    isSliding ? 'is-sliding' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={playerClasses}
      style={{
        left: `${x}%`,
        bottom: `calc(13% + ${jumpY}px)`,
      }}
      aria-label="Web Dev Runner Character"
    >
      {/* 2D Stylized Man Character Sprite */}
      <div className="man-body-wrapper">
        {/* Head with dark hair and peach face matching screenshot */}
        <div className="man-head">
          <div className="man-hair"></div>
          <div className="man-face">
            <div className="man-eye"></div>
          </div>
        </div>

        {/* Cyan/Blue Jacket matching screenshot */}
        <div className="man-torso">
          <div className="man-jacket">
            <div className="jacket-zipper"></div>
          </div>
          <div className="man-arm arm-back"></div>
          <div className="man-arm arm-front"></div>
        </div>

        {/* Dark Pants & Running Legs */}
        <div className="man-legs">
          <div className="man-leg leg-back">
            <div className="man-foot"></div>
          </div>
          <div className="man-leg leg-front">
            <div className="man-foot"></div>
          </div>
        </div>
      </div>

      {/* Ground Shadow on the platform surface */}
      <div
        className="man-ground-shadow"
        style={{
          transform: `scale(${isJumping ? Math.max(0.3, 1 - jumpY / 150) : 1})`,
          opacity: isJumping ? Math.max(0.2, 0.7 - jumpY / 180) : 0.7,
        }}
      ></div>

      {/* Action Indicators */}
      {isJumping && <span className="action-tag jump-tag">JUMP</span>}
      {isSliding && <span className="action-tag slide-tag">SLIDE</span>}

      {/* Visual Slide & Land Effect Particles */}
      {isSliding && <div className="slide-dust-cloud"></div>}
      {isLanding && <div className="landing-impact-dust"></div>}
    </div>
  )
}
