
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './i18n' // Import i18n configuration

// Log message for mapbox token
console.log('Note: To enable maps functionality, you need to provide a Mapbox token. Get one at https://mapbox.com');

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
