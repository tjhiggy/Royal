const PLANNER_STORAGE_KEY = 'royal-planner-v1'

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
