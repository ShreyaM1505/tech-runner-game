import { useEffect, useCallback } from 'react'

export function useControls({
  onMoveLeftStart,
  onMoveLeftEnd,
  onMoveRightStart,
  onMoveRightEnd,
  onJump,
  onSlide,
  isEnabled = true,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!isEnabled) return

      const key = e.key

      if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        e.preventDefault()
        onMoveLeftStart?.()
      } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        e.preventDefault()
        onMoveRightStart?.()
      } else if (key === 'ArrowUp' || key === 'w' || key === 'W' || key === ' ') {
        e.preventDefault()
        onJump?.()
      } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
        e.preventDefault()
        onSlide?.()
      }
    },
    [isEnabled, onMoveLeftStart, onMoveRightStart, onJump, onSlide]
  )

  const handleKeyUp = useCallback(
    (e) => {
      if (!isEnabled) return

      const key = e.key

      if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        e.preventDefault()
        onMoveLeftEnd?.()
      } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        e.preventDefault()
        onMoveRightEnd?.()
      }
    },
    [isEnabled, onMoveLeftEnd, onMoveRightEnd]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])
}
