const PLANNER_STORAGE_KEY = 'royal-planner-v1'
const COMPARE_STORAGE_KEY = 'royal-compare-scenarios-v1'

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
