import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from "./pages/layout/Dashboard";
import {Suspense} from "react";

function App() {

  return (
      <Router>
          <div style={{textAlign: 'center'}}>
              <Routes>
                  <Route path="/*" element={<Dashboard/>}/>
                  <Route path="*" element={<h1>404 Not Found</h1>} />
              </Routes>
          </div>

      </Router>
    )
}

export default function WrappedApp() {
    return (
        <Suspense fallback={<div>Okays, loading...</div>}>
            <App/>
        </Suspense>
    )
}
