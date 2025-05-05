import React from 'react';
import { useNavigate } from 'react-router-dom';
import BubbleMap     from '../components/BubbleMap';
import CreateJamForm from '../components/CreateJamForm';

export default function HomePage({ dynamicPages, newPageName, setNewPageName, createNewPage }) {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="auth-buttons">
        <button onClick={() => navigate('/login')} className="btn login-btn">
          Login
        </button>
      </div>

      <h1 className="site-title">Jamboree</h1>
      <h2 className="site-subtitle">Music is Better Together</h2>

      <BubbleMap dynamicPages={dynamicPages} />

      <CreateJamForm
        newPageName={newPageName}
        setNewPageName={setNewPageName}
        createNewPage={createNewPage}
      />
    </div>
  );
}
