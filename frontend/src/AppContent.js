import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage    from './pages/HomePage';
import DynamicPage from './pages/DynamicPage';
import LoginPage   from './pages/LoginPage';

export default function AppContent({ dynamicPages, newPageName, setNewPageName, createNewPage }) {
  const location = useLocation();

  useEffect(() => {
    document.body.style.background = 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    if (location.pathname === '/' || location.pathname.includes('/login')) {
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
    }
  }, [location.pathname]);

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                dynamicPages={dynamicPages}
                newPageName={newPageName}
                setNewPageName={setNewPageName}
                createNewPage={createNewPage}
              />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          {dynamicPages.map(p => (
            <Route
              key={p.id}
              path={p.path}
              element={<DynamicPage title={p.title} bubbleId={p.bubbleId} />}
            />
          ))}
        </Routes>
      </header>
    </div>
  );
}
