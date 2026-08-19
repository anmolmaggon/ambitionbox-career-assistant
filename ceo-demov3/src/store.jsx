import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialJourney, journeyPresets } from './data'

const JourneyContext = createContext(null)
const STORAGE_KEY = 'ambitionbox-ceo-demov3-journey-v1'

function loadInitial() {
  const preset = new URLSearchParams(window.location.search).get('preset')
  if (preset && journeyPresets[preset]) return { ...journeyPresets[preset] }
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
    update: (patch) => setJourney((current) => ({ ...current, ...patch })),
    toggleSaved: (id) => setJourney((current) => ({
      ...current,
      savedJobs: current.savedJobs.includes(id)
        ? current.savedJobs.filter((jobId) => jobId !== id)
        : [...current.savedJobs, id],
    })),
    applyPreset: (name) => setJourney({ ...(journeyPresets[name] || initialJourney) }),
    reset: () => {
      sessionStorage.removeItem(STORAGE_KEY)
      setJourney({ ...initialJourney })
    },
  }), [journey])

  return <JourneyContext.Provider value={api}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  return useContext(JourneyContext)
}
