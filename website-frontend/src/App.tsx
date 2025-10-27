import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from "./pages/layout/Dashboard";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

function App() {
    const { t } = useTranslation('common');
    return (
        <Router>
            <div style={{ textAlign: 'center' }}>
                <Routes>
                    <Route path="/*" element={<Dashboard />} />
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    )
}

export default function WrappedApp() {
    const { t } = useTranslation('common');
    return (
        <Suspense fallback={<div>{t('loading', 'Loading...')}</div>}>
            <App />
        </Suspense>
    )
}
