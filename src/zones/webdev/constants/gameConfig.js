// Configuration and obstacle definitions for Tech Runner - Web Development Zone (2D Side-Scroller)

export const LANES = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
}

export const DODGE_ACTIONS = {
  LANE: 'LANE',   // Avoid with Left/Right positioning
  JUMP: 'JUMP',   // Avoid with Jump
  SLIDE: 'SLIDE', // Avoid with Slide
}

export const OBSTACLE_TYPES = {
  API_ERROR: {
    id: 'API_ERROR',
    name: 'API Error',
    label: '500 API ERROR',
    requiredAction: DODGE_ACTIONS.JUMP,
    description: 'JUMP OVER',
    icon: '⚡💥',
    color: '#ef4444',
    placement: 'GROUND',
    widthPx: 80,
    heightPx: 52,
    jumpThresholdPx: 38,
  },
  DATABASE_TIMEOUT: {
    id: 'DATABASE_TIMEOUT',
    name: 'Database Timeout',
    label: '504 DB TIMEOUT',
    requiredAction: DODGE_ACTIONS.JUMP,
    description: 'JUMP OVER',
    icon: '🗄️⏱️',
    color: '#06b6d4',
    placement: 'GROUND',
    widthPx: 90,
    heightPx: 42,
    jumpThresholdPx: 32,
  },
  SLOW_PAGE: {
    id: 'SLOW_PAGE',
    name: 'Slow Page',
    label: 'SLOW PAGE LOAD',
    requiredAction: DODGE_ACTIONS.SLIDE,
    description: 'SLIDE UNDER',
    icon: '⏳🐌',
    color: '#f59e0b',
    placement: 'OVERHEAD',
    widthPx: 120,
    heightPx: 72,
    clearanceHeightPx: 30,
  },
  BROKEN_LAYOUT: {
    id: 'BROKEN_LAYOUT',
    name: 'Broken Layout',
    label: 'CSS LAYOUT GLITCH',
    requiredAction: DODGE_ACTIONS.SLIDE,
    description: 'SLIDE UNDER',
    icon: '📐⚠️',
    color: '#a855f7',
    placement: 'OVERHEAD',
    widthPx: 110,
    heightPx: 74,
    clearanceHeightPx: 30,
  },
  BROKEN_LINK: {
    id: 'BROKEN_LINK',
    name: 'Broken Link',
    label: '404 BROKEN LINK',
    requiredAction: DODGE_ACTIONS.LANE,
    description: 'DODGE LEFT ◀',
    icon: '🔗❌',
    color: '#ff3366',
    placement: 'LANE_FRONT',
    widthPx: 95,
    heightPx: 85,
    safeThresholdX: 23,
  },
  CORS_WALL: {
    id: 'CORS_WALL',
    name: 'CORS Wall',
    label: 'CORS BLOCKED',
    requiredAction: DODGE_ACTIONS.LANE,
    description: 'DODGE RIGHT ▶',
    icon: '🛡️🚫',
    color: '#ec4899',
    placement: 'LANE_REAR',
    widthPx: 95,
    heightPx: 95,
    safeThresholdX: 25,
  },
}

export const GAME_CONFIG = {
  TARGET_DISTANCE: 1000,   // Distance needed to complete level (meters)
  BASE_SPEED: 280,         // Horizontal scrolling speed in pixels per second
  PLAYER_MIN_X: 9,         // Left boundary percentage
  PLAYER_MAX_X: 40,        // Right boundary percentage
  PLAYER_DEFAULT_X: 18,    // Starting X percentage
  MOVE_SPEED: 28,          // Speed of horizontal movement (% per second)
  JUMP_HEIGHT: 125,        // Jump height in px
  JUMP_DURATION_MS: 640,   // Jump air time
  SLIDE_DURATION_MS: 600,  // Slide duration
  SPAWN_SPACING_MIN: 75,   // Generous distance between obstacles (meters)
  SPAWN_SPACING_MAX: 105,
  POINTS_PER_METER: 1,
  POINTS_PER_DODGE: 60,
  POINTS_PER_COIN: 25,
}
