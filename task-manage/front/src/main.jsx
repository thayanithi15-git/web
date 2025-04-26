import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FrontendOnly from '../../../task-manage/front/src/frontendonly.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FrontendOnly />
    {/* <App /> */}
  </StrictMode>,
)
