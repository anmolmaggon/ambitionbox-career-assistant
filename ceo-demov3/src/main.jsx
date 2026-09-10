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
 * Visual direction, chosen by `?look=bold` and remembered for the session so it survives
 * the bottom nav's round trips. `current` is the default and stamps nothing, which keeps
 * the Playwright suite and every capture on the existing design.
 */
try {
  const asked = new URLSearchParams(window.location.search).get('look')
  if (asked) sessionStorage.setItem('north-look', asked)
  const look = sessionStorage.getItem('north-look')
  if (look && look !== 'current') document.documentElement.dataset.look = look
} catch (error) { /* private mode: the default look is the right fallback */ }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JourneyProvider>
      <App />
    </JourneyProvider>
  </React.StrictMode>,
)
