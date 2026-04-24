const PLANNER_STORAGE_KEY = 'royal-planner-v1'
const COMPARE_STORAGE_KEY = 'royal-compare-scenarios-v1'
const RECENT_TRIPS_STORAGE_KEY = 'royal-recent-trips-v1'
const SNAPSHOT_STORAGE_KEY = 'royal-snapshot-state-v1'

export function loadPlannerState(defaultState) {
  try {
    const saved = window.localStorage.getItem(PLANNER_STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultState
  } catch {
    return defaultState
  }
}

export function savePlannerState(state) {
  window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(state))
}

export function clearPlannerState() {
  window.localStorage.removeItem(PLANNER_STORAGE_KEY)
}

export function loadCompareScenarios() {
  try {
    const saved = window.localStorage.getItem(COMPARE_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function saveCompareScenarios(scenarios) {
  window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(scenarios))
}

export function loadRecentTrips() {
  try {
    const saved = window.localStorage.getItem(RECENT_TRIPS_STORAGE_KEY)
    return saved ? sortRecentTrips(JSON.parse(saved)) : []
  } catch {
    return []
  }
}

export function getRecentTripById(id) {
  return loadRecentTrips().find((trip) => trip.id === id) ?? null
}

export function removeRecentTripById(id) {
  const nextTrips = sortRecentTrips(loadRecentTrips().filter((trip) => trip.id !== id))
  window.localStorage.setItem(RECENT_TRIPS_STORAGE_KEY, JSON.stringify(nextTrips))
  return nextTrips
}

export function clearRecentTrips() {
  window.localStorage.removeItem(RECENT_TRIPS_STORAGE_KEY)
  return []
}

export function saveRecentTrip(session) {
  const currentTrips = loadRecentTrips()
  const existingSession = currentTrips.find((trip) => trip.id === session.id)
  const nextSession = {
    ...existingSession,
    ...session,
    customLabel: existingSession?.customLabel ?? session.customLabel,
    isPinned: existingSession?.isPinned ?? session.isPinned ?? false,
    updatedAt: new Date().toISOString(),
  }
  const nextTrips = sortRecentTrips([
    nextSession,
    ...currentTrips.filter((trip) => trip.id !== nextSession.id),
  ]).slice(0, 3)

  window.localStorage.setItem(RECENT_TRIPS_STORAGE_KEY, JSON.stringify(nextTrips))
  return nextTrips
}

export function renameRecentTrip(id, customLabel) {
  const cleanedLabel = customLabel.trim()
  const nextTrips = sortRecentTrips(loadRecentTrips().map((trip) => (
    trip.id === id
      ? { ...trip, customLabel: cleanedLabel || undefined }
      : trip
  )))

  window.localStorage.setItem(RECENT_TRIPS_STORAGE_KEY, JSON.stringify(nextTrips))
  return nextTrips
}

export function toggleRecentTripPin(id) {
  const nextTrips = sortRecentTrips(loadRecentTrips().map((trip) => (
    trip.id === id ? { ...trip, isPinned: !trip.isPinned } : trip
  ))).slice(0, 3)

  window.localStorage.setItem(RECENT_TRIPS_STORAGE_KEY, JSON.stringify(nextTrips))
  return nextTrips
}

function sortRecentTrips(trips) {
  return [...trips].sort((left, right) => {
    if (Boolean(left.isPinned) !== Boolean(right.isPinned)) {
      return left.isPinned ? -1 : 1
    }

    return new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0)
  })
}

export function loadSnapshotState(defaultState = {}) {
  try {
    const saved = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultState
  } catch {
    return defaultState
  }
}

export function saveSnapshotToolState(tool, data) {
  const currentState = loadSnapshotState({})
  const nextState = {
    ...currentState,
    [tool]: {
      ...data,
      updatedAt: new Date().toISOString(),
    },
  }

  window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(nextState))
  return nextState
}
