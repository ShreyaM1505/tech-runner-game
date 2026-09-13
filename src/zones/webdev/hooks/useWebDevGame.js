import { useState, useEffect, useRef, useCallback } from 'react'
import {
  OBSTACLE_TYPES,
  GAME_CONFIG,
} from '../constants/gameConfig'
import { recordService } from '../services/recordService'

const OBSTACLE_KEYS = Object.keys(OBSTACLE_TYPES)

export function useWebDevGame({
  onZoneComplete,
  onGameOver,
  onScoreChange,
  targetDistance = GAME_CONFIG.TARGET_DISTANCE,
  autoStart = false,
  playerId,
}) {
  const [status, setStatus] = useState(autoStart ? 'PLAYING' : 'IDLE')
  const [playerX, setPlayerX] = useState(GAME_CONFIG.PLAYER_DEFAULT_X)
  const [jumpY, setJumpY] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [isLanding, setIsLanding] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [distance, setDistance] = useState(0)
  const [score, setScore] = useState(0)
  const [coinsCount, setCoinsCount] = useState(0)
  const [lives, setLives] = useState(4)
  const [dodgedCount, setDodgedCount] = useState(0)
  const [obstaclesHit, setObstaclesHit] = useState(0)
  const [completionRecord, setCompletionRecord] = useState(null)
  const [victoryPoint, setVictoryPoint] = useState(null)
  const [obstacles, setObstacles] = useState([])
  const [coins, setCoins] = useState([])
  const [lastCollisionObstacle, setLastCollisionObstacle] = useState(null)
  const [isInvulnerable, setIsInvulnerable] = useState(false)

  // Internal mutable state for 60fps game loop
  const stateRef = useRef({
    status: autoStart ? 'PLAYING' : 'IDLE',
    playerX: GAME_CONFIG.PLAYER_DEFAULT_X,
    moveLeftHeld: false,
    moveRightHeld: false,
    jumpY: 0,
    jumpStartTime: null,
    isJumping: false,
    isSliding: false,
    distance: 0,
    score: 0,
    coinsCount: 0,
    lives: 4,
    dodgedCount: 0,
    obstaclesHit: 0,
    elapsedTime: 0,
    victoryPoint: null,
    obstacles: [],
    coins: [],
    nextSpawnDistance: 60, // First obstacle after a comfortable start
    nextCoinDistance: 25,
    invulnerableUntil: 0,
    lastTime: null,
  })

  // JUMP trigger
  const triggerJump = useCallback(() => {
    if (stateRef.current.status !== 'PLAYING') return
    if (stateRef.current.isJumping || stateRef.current.isSliding) return

    const now = performance.now()
    stateRef.current.isJumping = true
    stateRef.current.jumpStartTime = now

    // Immediate initial displacement so the very first render already moves upwards
    const initialJumpY = Math.sin((16 / GAME_CONFIG.JUMP_DURATION_MS) * Math.PI) * GAME_CONFIG.JUMP_HEIGHT
    stateRef.current.jumpY = initialJumpY
    setIsJumping(true)
    setJumpY(initialJumpY)
  }, [])

  // SLIDE trigger
  const slideTimerRef = useRef(null)
  const triggerSlide = useCallback(() => {
    if (stateRef.current.status !== 'PLAYING') return
    if (stateRef.current.isSliding || stateRef.current.isJumping) return

    stateRef.current.isSliding = true
    setIsSliding(true)

    if (slideTimerRef.current) clearTimeout(slideTimerRef.current)
    slideTimerRef.current = setTimeout(() => {
      stateRef.current.isSliding = false
      setIsSliding(false)
    }, GAME_CONFIG.SLIDE_DURATION_MS)
  }, [])

  // Movement press/release handlers
  const setMoveLeft = useCallback((active) => {
    stateRef.current.moveLeftHeld = active
  }, [])

  const setMoveRight = useCallback((active) => {
    stateRef.current.moveRightHeld = active
  }, [])

  // Toggle pause
  const togglePause = useCallback(() => {
    setStatus((prev) => {
      if (prev === 'PLAYING') {
        stateRef.current.status = 'PAUSED'
        return 'PAUSED'
      }
      if (prev === 'PAUSED') {
        stateRef.current.status = 'PLAYING'
        stateRef.current.lastTime = performance.now()
        return 'PLAYING'
      }
      return prev
    })
  }, [])

  // Start / Restart game
  const startGame = useCallback(() => {
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current)

    stateRef.current = {
      status: 'PLAYING',
      playerX: GAME_CONFIG.PLAYER_DEFAULT_X,
      moveLeftHeld: false,
      moveRightHeld: false,
      jumpY: 0,
      jumpStartTime: null,
      isJumping: false,
      isSliding: false,
      distance: 0,
      score: 0,
      coinsCount: 0,
      lives: 4,
      dodgedCount: 0,
      obstaclesHit: 0,
      elapsedTime: 0,
      victoryPoint: null,
      obstacles: [],
      coins: [],
      nextSpawnDistance: 60,
      nextCoinDistance: 25,
      invulnerableUntil: 0,
      lastTime: null,
    }

    setPlayerX(GAME_CONFIG.PLAYER_DEFAULT_X)
    setJumpY(0)
    setIsJumping(false)
    setIsSliding(false)
    setDistance(0)
    setScore(0)
    setCoinsCount(0)
    setLives(4)
    setDodgedCount(0)
    setObstaclesHit(0)
    setCompletionRecord(null)
    setVictoryPoint(null)
    setObstacles([])
    setCoins([])
    setLastCollisionObstacle(null)
    setIsInvulnerable(false)
    setStatus('PLAYING')
  }, [])

  // Spawn one of the 6 web development obstacles
  const spawnObstacle = useCallback(() => {
    const randomKey = OBSTACLE_KEYS[Math.floor(Math.random() * OBSTACLE_KEYS.length)]
    const template = OBSTACLE_TYPES[randomKey]

    return {
      id: `${template.id}-${Date.now()}-${Math.random()}`,
      type: template.id,
      config: template,
      x: 108, // Start slightly off the right viewport
      passed: false,
      hasCollided: false,
    }
  }, [])

  // Spawn coin line (placed in safe areas between obstacles)
  const spawnCoinRow = useCallback(() => {
    const rowCount = 3
    const newCoins = []
    const baseY = 16
    for (let i = 0; i < rowCount; i++) {
      newCoins.push({
        id: `coin-${Date.now()}-${i}-${Math.random()}`,
        x: 106 + i * 4,
        y: baseY,
        collected: false,
      })
    }
    return newCoins
  }, [])

  // Main 60fps Game Loop
  useEffect(() => {
    if (status !== 'PLAYING') return

    let animationFrameId
    stateRef.current.lastTime = performance.now()

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - stateRef.current.lastTime) / 1000, 0.1)
      stateRef.current.lastTime = currentTime
      stateRef.current.elapsedTime += dt

      // 1. Advance track distance
      const distanceSpeed = 22 // meters/sec
      const currentDist = stateRef.current.distance + distanceSpeed * dt
      stateRef.current.distance = currentDist

      // Common track scroll speed
      const scrollSpeed = 28 // % of screen width per second

      // 2. Handle Player Horizontal Left/Right Movement
      let curX = stateRef.current.playerX
      if (stateRef.current.moveLeftHeld) {
        curX -= GAME_CONFIG.MOVE_SPEED * dt
      }
      if (stateRef.current.moveRightHeld) {
        curX += GAME_CONFIG.MOVE_SPEED * dt
      }
      curX = Math.max(GAME_CONFIG.PLAYER_MIN_X, Math.min(GAME_CONFIG.PLAYER_MAX_X, curX))
      stateRef.current.playerX = curX

      // 3. Victory Point Check (Available after 45 seconds of gameplay)
      // Before 45 seconds: do not allow level completion
      // At 45 seconds: show the Victory/Finish Point at the end of the path
      const victoryThreshold = GAME_CONFIG.VICTORY_TIME_SECONDS || 45
      if (stateRef.current.elapsedTime >= victoryThreshold && !stateRef.current.victoryPoint) {
        stateRef.current.victoryPoint = {
          x: 105, // End of the visible track path
          active: true,
        }
        setVictoryPoint({ ...stateRef.current.victoryPoint })
      }

      // If Victory Point is active, scroll it along the path towards the player
      if (stateRef.current.victoryPoint && stateRef.current.victoryPoint.active) {
        stateRef.current.victoryPoint.x -= scrollSpeed * dt
        setVictoryPoint({ ...stateRef.current.victoryPoint })

        // When the player reaches the Victory Point, trigger level-completed event
        if (stateRef.current.victoryPoint.x <= curX) {
          stateRef.current.status = 'COMPLETED'
          setStatus('COMPLETED')
          const finalScore = stateRef.current.score + Math.floor(currentDist)
          setScore(finalScore)
          setDistance(Math.floor(currentDist))
          onScoreChange?.(finalScore)

          const runDuration = stateRef.current.elapsedTime
          const formattedTime = recordService.formatCompletionTime(runDuration)

          const completionEventPayload = {
            status: 'COMPLETED',
            zoneId: 'web_development',
            domain: 'web_development',
            nextZoneId: 'domain_3',
            playerId,
            score: finalScore,
            distance: Math.floor(currentDist),
            coins: stateRef.current.coinsCount,
            obstaclesAvoided: stateRef.current.dodgedCount,
            obstaclesHit: stateRef.current.obstaclesHit,
            completionTime: formattedTime,
            completionDurationSeconds: Math.round(runDuration * 100) / 100,
            victoryReached: true,
            metadata: {
              targetDistance,
              livesRemaining: stateRef.current.lives,
              victoryTimeRequired: victoryThreshold,
            },
          }

          // Persist via modular record service (supports LocalStorage & API/DB)
          recordService
            .saveCompletionRecord(completionEventPayload)
            .then((savedRecord) => {
              const fullPayload = { ...completionEventPayload, ...savedRecord }
              setCompletionRecord(fullPayload)
              onZoneComplete?.(fullPayload)
            })
            .catch((err) => {
              console.error('[WebDevZone] Failed to store completion record:', err)
              const fallbackRecord = {
                ...completionEventPayload,
                id: `rec_${Date.now()}`,
                completedAt: new Date().toISOString(),
              }
              setCompletionRecord(fallbackRecord)
              onZoneComplete?.(fallbackRecord)
            })

          return
        }
      }

      // 4. Handle Jump Physics (Smooth parabolic arc + landing bounce)
      if (stateRef.current.isJumping) {
        const elapsed = currentTime - stateRef.current.jumpStartTime
        const progress = elapsed / GAME_CONFIG.JUMP_DURATION_MS
        if (progress >= 1) {
          stateRef.current.isJumping = false
          stateRef.current.jumpY = 0
          setIsJumping(false)
          setIsLanding(true)
          setTimeout(() => setIsLanding(false), 200)
        } else {
          const arc = Math.sin(progress * Math.PI)
          stateRef.current.jumpY = arc * GAME_CONFIG.JUMP_HEIGHT
        }
      } else {
        stateRef.current.jumpY = 0
      }

      // 5. Procedural Spawning with Generous Spacing
      // Do not spawn new obstacles directly at or behind the finish line once active
      if (!stateRef.current.victoryPoint && currentDist >= stateRef.current.nextSpawnDistance) {
        stateRef.current.obstacles.push(spawnObstacle())
        // Set generous gap: 75m to 105m (approx 3.5 to 4.8 seconds between obstacles)
        const spacing = GAME_CONFIG.SPAWN_SPACING_MIN + Math.random() * (GAME_CONFIG.SPAWN_SPACING_MAX - GAME_CONFIG.SPAWN_SPACING_MIN)
        stateRef.current.nextSpawnDistance = currentDist + spacing
      }

      if (currentDist >= stateRef.current.nextCoinDistance) {
        stateRef.current.coins.push(...spawnCoinRow())
        stateRef.current.nextCoinDistance = currentDist + 45 + Math.random() * 25
      }

      // 5. Update Obstacles and Evaluate Accurate Visible Collision
      const activeObstacles = []
      let collisionDetected = false
      let fatalObstacle = null
      let newDodges = 0

      for (let obs of stateRef.current.obstacles) {
        obs.x -= scrollSpeed * dt

        // Check horizontal proximity (effective hit window based on obstacle width)
        const hitWindow = (obs.config.widthPx / 960) * 50 // Half-width window in %
        const isHorizontallyAligned = Math.abs(obs.x - curX) < hitWindow

        if (isHorizontallyAligned && !obs.hasCollided && !obs.passed) {
          const { placement } = obs.config

          let hit = false
          if (placement === 'GROUND') {
            // Must jump high enough to clear the ground obstacle (API_ERROR, DATABASE_TIMEOUT)
            hit = stateRef.current.jumpY < obs.config.jumpThresholdPx
          } else if (placement === 'OVERHEAD') {
            // Must slide underneath the overhead obstacle (SLOW_PAGE, BROKEN_LAYOUT)
            hit = !stateRef.current.isSliding
          } else if (placement === 'LANE_FRONT') {
            // BROKEN_LINK: Danger zone is the forward half (player must move Left)
            hit = curX >= obs.config.safeThresholdX
          } else if (placement === 'LANE_REAR') {
            // CORS_WALL: Danger zone is the rear half (player must move Right)
            hit = curX <= obs.config.safeThresholdX
          }

          if (hit) {
            // Process collision with invulnerability protection
            if (currentTime > stateRef.current.invulnerableUntil) {
              obs.hasCollided = true
              collisionDetected = true
              fatalObstacle = obs.config
              stateRef.current.lives -= 1
              stateRef.current.obstaclesHit += 1
              stateRef.current.invulnerableUntil = currentTime + 1200
              setLives(stateRef.current.lives)
              setObstaclesHit(stateRef.current.obstaclesHit)
              setIsInvulnerable(true)
              setTimeout(() => setIsInvulnerable(false), 1200)

              if (stateRef.current.lives <= 0) {
                stateRef.current.status = 'GAME_OVER'
                setStatus('GAME_OVER')
                setLastCollisionObstacle(fatalObstacle)
                const finalScore = stateRef.current.score + Math.floor(currentDist)
                setScore(finalScore)
                setDistance(Math.floor(currentDist))
                onScoreChange?.(finalScore)
                onGameOver?.({
                  status: 'GAME_OVER',
                  zoneId: 'web_development',
                  reason: 'ALL_HEARTS_LOST',
                  livesRemaining: 0,
                  score: finalScore,
                  distance: Math.floor(currentDist),
                  obstacle: fatalObstacle,
                  elapsedTime: stateRef.current.elapsedTime,
                })
                return
              }
            }
          }
        }

        // Successfully passed check
        if (obs.x < curX - hitWindow && !obs.passed && !obs.hasCollided) {
          obs.passed = true
          newDodges += 1
        }

        // Keep visible obstacles
        if (obs.x > -20) {
          activeObstacles.push(obs)
        }
      }

      stateRef.current.obstacles = activeObstacles

      // 6. Coins handling with smooth collection animation
      const activeCoins = []
      let newCoinsCollected = 0
      for (let coin of stateRef.current.coins) {
        coin.x -= scrollSpeed * dt
        if (!coin.collected && Math.abs(coin.x - curX) < 3.5 && stateRef.current.jumpY < 40) {
          coin.collected = true
          coin.collectTime = currentTime
          newCoinsCollected += 1
          activeCoins.push(coin)
        } else if (coin.collected) {
          // Allow coin collection animation to play for 350ms before removing
          if (currentTime - coin.collectTime < 350) {
            activeCoins.push(coin)
          }
        } else if (coin.x > -10) {
          activeCoins.push(coin)
        }
      }
      stateRef.current.coins = activeCoins

      if (newCoinsCollected > 0) {
        stateRef.current.coinsCount += newCoinsCollected
        stateRef.current.score += newCoinsCollected * GAME_CONFIG.POINTS_PER_COIN
        setCoinsCount(stateRef.current.coinsCount)
      }

      if (newDodges > 0) {
        stateRef.current.dodgedCount += newDodges
        stateRef.current.score += newDodges * GAME_CONFIG.POINTS_PER_DODGE
        setDodgedCount(stateRef.current.dodgedCount)
      }

      // Sync React state
      const currentScore = stateRef.current.score + Math.floor(currentDist)
      setPlayerX(curX)
      setJumpY(stateRef.current.jumpY)
      setDistance(Math.floor(currentDist))
      setScore(currentScore)
      setObstacles([...activeObstacles])
      setCoins([...activeCoins])
      onScoreChange?.(currentScore)

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [status, targetDistance, spawnObstacle, spawnCoinRow, onScoreChange, onZoneComplete, onGameOver, playerId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current)
    }
  }, [])

  return {
    status,
    playerX,
    jumpY,
    isJumping,
    isLanding,
    isSliding,
    distance,
    targetDistance,
    score,
    coinsCount,
    lives,
    dodgedCount,
    obstaclesHit,
    completionRecord,
    victoryPoint,
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
  }
}
