import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialJourney, journeyPresets, stageIndex, stateForStage, STAGES } from './data'

const JourneyContext = createContext(null)
const STORAGE_KEY = 'ambitionbox-ceo-demo-v2-journey-v1'

function clearBootstrapParams() {
  if (!window.location.search) return
  window.history.replaceState({}, '', window.location.pathname)
}

function loadInitial() {
  const params = new URLSearchParams(window.location.search)
  const preset = params.get('preset')
  const requestedStage = params.get('stage')
  if (preset && journeyPresets[preset]) return { ...journeyPresets[preset] }
  if (requestedStage && STAGES.includes(requestedStage)) return stateForStage(requestedStage)
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialJourney, ...JSON.parse(saved) } : { ...initialJourney }
  } catch {
    return { ...initialJourney }
  }
}

export function JourneyProvider({ children }) {
  const [journey, setJourney] = useState(loadInitial)

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(journey))
  }, [journey])

  const api = useMemo(() => ({
    journey,
    advance: (nextStage, patch = {}) => {
      clearBootstrapParams()
      setJourney((current) => {
        if (!STAGES.includes(nextStage) || stageIndex(nextStage) < stageIndex(current.stage)) return current
        return { ...current, ...patch, stage: nextStage }
      })
    },
    save: (patch) => setJourney((current) => ({ ...current, ...patch })),
    applyPreset: (name) => setJourney({ ...(journeyPresets[name] || initialJourney) }),
    reset: () => {
      sessionStorage.removeItem(STORAGE_KEY)
      setJourney({ ...initialJourney })
    },
  }), [journey])

  return <JourneyContext.Provider value={api}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const context = useContext(JourneyContext)
  if (!context) throw new Error('useJourney must be used inside JourneyProvider')
  return context
}
