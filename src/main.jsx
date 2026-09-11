import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import PasscodeGate from './components/PasscodeGate.jsx'
import './index.css'

const App = lazy(() => import('./App.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PasscodeGate>
      <Suspense fallback={(
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-white text-2xl font-semibold'>Loading...</div>
        </div>
      )}>
        <App />
      </Suspense>
    </PasscodeGate>
  </React.StrictMode>,
)
