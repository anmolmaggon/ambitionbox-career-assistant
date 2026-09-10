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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JourneyProvider>
      <App />
    </JourneyProvider>
  </React.StrictMode>,
)
