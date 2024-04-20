import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CurrentPlayerProvider } from './contexts/CurrentPlayerProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrentPlayerProvider>
      <App />
    </CurrentPlayerProvider>
  </React.StrictMode>,
)
