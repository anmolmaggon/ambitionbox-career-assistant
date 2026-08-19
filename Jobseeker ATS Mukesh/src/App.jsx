import { useState } from 'react'
import Landing from './screens/Landing'
import GmailConnect from './screens/GmailConnect'
import AIProcessing from './screens/AIProcessing'
import AppShell from './screens/AppShell'
import ABHeader from './components/ABHeader'
import ABLeftNav from './components/ABLeftNav'

export default function App() {
  const [flow, setFlow] = useState('landing')

  if (flow === 'processing') return <AIProcessing onComplete={() => setFlow('app')} />
  if (flow === 'app')        return <AppShell />

  // landing + connect: always show the AmbitionBox shell
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <ABHeader />
      <div className="flex flex-1 overflow-hidden">
        <ABLeftNav />
        <div className="flex-1 overflow-hidden relative">
          <Landing onContinue={() => setFlow('connect')} />
          {flow === 'connect' && (
            <GmailConnect
              onConnect={() => setFlow('processing')}
              onClose={() => setFlow('landing')}
              skipConsent={true}
            />
          )}
        </div>
      </div>
    </div>
  )
}
