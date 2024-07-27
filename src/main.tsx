import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { PagePrivacy } from './Privacy.tsx';
import { PageAboutUs } from './AboutUs.tsx';
import { PageProvider } from './Provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/provider" element={<PageProvider />} />
      {/* <Route path="/countrySelect" element={<License />} /> */}
      {/* <Route path="/settings" element={<License />} /> */}
      <Route path="/aboutus" element={<PageAboutUs />} />
      <Route path="/privacy" element={<PagePrivacy />} />
    </Routes>
  </Router>,
)
