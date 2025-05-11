import { render } from 'preact'
import { CookiesProvider } from 'react-cookie'

import App from './app.tsx'
import './index.css'

render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  document.getElementById('app') as HTMLElement,
)
