/**
 * Modular Record Service for Tech Runner: Web Development Zone
 * 
 * Supports swappable storage providers (LocalStorage, REST API, Database).
 * Stores completion records containing:
 * - Player ID
 * - Score
 * - Coins
 * - Obstacles Avoided
 * - Obstacles Hit
 * - Completion Time
 */

const STORAGE_KEY = 'techrunner_webdev_records'
const PLAYER_ID_KEY = 'techrunner_player_id'

/**
 * Base Abstract Provider Contract
 */
export class RecordStorageProvider {
  async save(record) {
    throw new Error('RecordStorageProvider.save() must be implemented by subclass')
  }

  async getAll() {
    throw new Error('RecordStorageProvider.getAll() must be implemented by subclass')
  }

  async getLatest() {
    throw new Error('RecordStorageProvider.getLatest() must be implemented by subclass')
  }
}

/**
 * LocalStorage Provider with Memory Fallback
 * Primary provider for client-side storage
 */
export class LocalStorageRecordProvider extends RecordStorageProvider {
  constructor(storageKey = STORAGE_KEY) {
    super()
    this.storageKey = storageKey
    this.memoryFallback = []
  }

  _isStorageAvailable() {
    try {
      return typeof window !== 'undefined' && !!window.localStorage
    } catch {
      return false
    }
  }

  async save(record) {
    if (this._isStorageAvailable()) {
      try {
        const existing = await this.getAll()
        const updated = [record, ...existing]
        window.localStorage.setItem(this.storageKey, JSON.stringify(updated))
        return record
      } catch (err) {
        console.warn('[RecordService] LocalStorage save failed, using memory fallback:', err)
      }
    }
    this.memoryFallback.unshift(record)
    return record
  }

  async getAll() {
    if (this._isStorageAvailable()) {
      try {
        const raw = window.localStorage.getItem(this.storageKey)
        return raw ? JSON.parse(raw) : []
      } catch (err) {
        console.warn('[RecordService] LocalStorage read failed:', err)
        return this.memoryFallback
      }
    }
    return this.memoryFallback
  }

  async getLatest() {
    const all = await this.getAll()
    return all.length > 0 ? all[0] : null
  }
}

/**
 * API / Database Provider Template
 * Pluggable provider for future backend/database integration (Node/Express, Firebase, Supabase, Postgres, etc.)
 */
export class ApiRecordProvider extends RecordStorageProvider {
  constructor({ endpointUrl = '/api/webdev/records', headers = {}, authToken = null } = {}) {
    super()
    this.endpointUrl = endpointUrl
    this.headers = {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    }
  }

  async save(record) {
    const res = await fetch(this.endpointUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(record),
    })

    if (!res.ok) {
      throw new Error(`[ApiRecordProvider] Failed to save record: ${res.statusText}`)
    }

    return await res.json()
  }

  async getAll() {
    const res = await fetch(this.endpointUrl, {
      method: 'GET',
      headers: this.headers,
    })

    if (!res.ok) {
      throw new Error(`[ApiRecordProvider] Failed to fetch records: ${res.statusText}`)
    }

    return await res.json()
  }

  async getLatest() {
    const res = await fetch(`${this.endpointUrl}/latest`, {
      method: 'GET',
      headers: this.headers,
    })

    if (!res.ok) {
      const all = await this.getAll()
      return all.length > 0 ? all[0] : null
    }

    return await res.json()
  }
}

/**
 * Service orchestrator managing active provider and record creation
 */
export class CompletionRecordService {
  constructor(provider = new LocalStorageRecordProvider()) {
    this.provider = provider
    this.listeners = new Set()
  }

  /**
   * Swap out storage provider for backend/database integration
   * @param {RecordStorageProvider} provider 
   */
  setProvider(provider) {
    if (!provider || typeof provider.save !== 'function') {
      throw new Error('[RecordService] Invalid provider: must implement save()')
    }
    this.provider = provider
  }

  /**
   * Get or generate a persistent player ID
   * @returns {string}
   */
  getPlayerId() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(PLAYER_ID_KEY)
        if (stored) return stored
        const newId = `DEV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        window.localStorage.setItem(PLAYER_ID_KEY, newId)
        return newId
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return 'DEV-GUEST'
  }

  /**
   * Set custom player ID
   * @param {string} id 
   */
  setPlayerId(id) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PLAYER_ID_KEY, id)
      }
    } catch {
      // ignore
    }
  }

  /**
   * Format duration into readable MM:SS.s string
   * @param {number} totalSeconds 
   * @returns {string}
   */
  formatCompletionTime(totalSeconds) {
    if (typeof totalSeconds !== 'number' || isNaN(totalSeconds)) return '00:00.0'
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const tenths = Math.floor((totalSeconds % 1) * 10)
    const mm = String(minutes).padStart(2, '0')
    const ss = String(seconds).padStart(2, '0')
    return `${mm}:${ss}.${tenths}`
  }

  /**
   * Store a Web Development completion record
   * 
   * @param {Object} data
   * @param {string} [data.playerId] - Optional Player ID override
   * @param {number} data.score - Final score earned
   * @param {number} data.coins - Total coins collected
   * @param {number} data.obstaclesAvoided - Count of obstacles successfully avoided
   * @param {number} data.obstaclesHit - Count of obstacles collided with
   * @param {number|string} data.completionTime - Elapsed active run time
   * @param {Object} [data.metadata] - Optional additional details (distance, lives left, etc.)
   * @returns {Promise<Object>} The stored completion record
   */
  async saveCompletionRecord({
    playerId,
    score = 0,
    coins = 0,
    obstaclesAvoided = 0,
    obstaclesHit = 0,
    completionTime,
    completionDurationSeconds = 0,
    metadata = {},
  }) {
    const resolvedPlayerId = playerId || this.getPlayerId()
    const resolvedDuration = typeof completionDurationSeconds === 'number' && completionDurationSeconds > 0
      ? completionDurationSeconds
      : (typeof completionTime === 'number' ? completionTime : 0)

    const formattedTime = typeof completionTime === 'string'
      ? completionTime
      : this.formatCompletionTime(resolvedDuration)

    const record = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      domain: 'web_development',
      zoneName: 'Zone 2: Web Development',
      playerId: resolvedPlayerId,
      score: Math.round(Number(score) || 0),
      coins: Math.round(Number(coins) || 0),
      obstaclesAvoided: Math.round(Number(obstaclesAvoided) || 0),
      obstaclesHit: Math.round(Number(obstaclesHit) || 0),
      completionTime: formattedTime,
      completionDurationSeconds: Math.round(resolvedDuration * 100) / 100,
      completedAt: new Date().toISOString(),
      metadata: {
        ...metadata,
      },
    }

    const saved = await this.provider.save(record)
    this.notify(saved)
    return saved
  }

  async getRecords() {
    return await this.provider.getAll()
  }

  async getLatestRecord() {
    return await this.provider.getLatest()
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify(record) {
    this.listeners.forEach((listener) => {
      try {
        listener(record)
      } catch (err) {
        console.error('[RecordService] Listener error:', err)
      }
    })
  }
}

// Export singleton instance for app-wide use
export const recordService = new CompletionRecordService()
