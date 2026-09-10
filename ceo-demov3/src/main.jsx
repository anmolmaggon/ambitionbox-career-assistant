import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/figtree'
import { JourneyProvider } from './store'
import App from './App'
import './tokens.css'
import './styles.css'
import './north.css'
import './onboarding.css'
import './home.css'
import './offer-v3.css'
import './prep-v3.css'
import './flow.css'
import './bold.css'

/*
 * Visual direction. `bold` is the design now, so it is stamped by default and the plain
 * deployed URL — the one people get sent — shows it. `?look=current` still reaches the
 * earlier design for comparison, and either choice is remembered for the session so it
 * survives the bottom nav's round trips.
 */
try {
  const asked = new URLSearchParams(window.location.search).get('look')
  if (asked) sessionStorage.setItem('north-look', asked)
  const look = sessionStorage.getItem('north-look') || 'bold'
  if (look !== 'current') document.documentElement.dataset.look = look
} catch (error) {
  /* private mode: no memory to read, so fall back to the default look rather than none */
  document.documentElement.dataset.look = 'bold'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JourneyProvider>
      <App />
    </JourneyProvider>
  </React.StrictMode>,
)
